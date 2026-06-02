function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function safe(name) { return (name || '').replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, ''); }

function styleVal(v) {
  if (typeof v === 'string') return `'${v}'`;
  if (typeof v === 'object' && v !== null) return JSON.stringify(v);
  return String(v);
}

function styleBlock(obj, indent = '    ') {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${indent}${k}: ${styleVal(v)},`)
    .join('\n');
}

function genScreenCode(screen, allScreens) {
  const rnImports = new Set(['View', 'StyleSheet', 'ScrollView', 'SafeAreaView']);
  const iconLibs = new Set();
  const stateVars = [];
  const effects = [];
  const jsx = [];
  const styles = {};

  styles.container = { flex: 1, backgroundColor: screen.backgroundColor || '#f5f5f5' };
  styles.scroll = { flex: 1 };

  (screen.elements || []).forEach((el, idx) => {
    const sid = `${el.type.toLowerCase()}${idx + 1}`;
    const p = el.props;

    switch (el.type) {
      case 'Text':
        rnImports.add('Text');
        jsx.push(`        <Text style={styles.${sid}}>${p.text}</Text>`);
        styles[sid] = { fontSize: p.fontSize, color: p.color, fontWeight: p.fontWeight, textAlign: p.textAlign, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;

      case 'Button': {
        rnImports.add('TouchableOpacity'); rnImports.add('Text'); rnImports.add('Alert');
        let onPress = '() => {}';
        if (p.action === 'navigate' && p.targetScreen) onPress = `() => navigation.navigate('${p.targetScreen}')`;
        else if (p.action === 'alert') onPress = `() => Alert.alert('Aviso', '${p.alertMessage || ''}')`;
        jsx.push(`        <TouchableOpacity style={styles.${sid}} onPress={${onPress}} activeOpacity={0.8}>`);
        jsx.push(`          <Text style={styles.${sid}Label}>${p.label}</Text>`);
        jsx.push(`        </TouchableOpacity>`);
        styles[sid] = { backgroundColor: p.backgroundColor, borderRadius: p.borderRadius, paddingVertical: p.paddingVertical, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight, alignItems: 'center' };
        styles[`${sid}Label`] = { color: p.textColor, fontSize: p.fontSize, fontWeight: 'bold' };
        break;
      }

      case 'Image':
        rnImports.add('Image');
        jsx.push(`        <Image source={{ uri: '${p.source}' }} style={styles.${sid}} resizeMode="${p.resizeMode}" />`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'Input':
        rnImports.add('TextInput');
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState('');`);
        jsx.push(`        <TextInput`);
        jsx.push(`          style={styles.${sid}}`);
        jsx.push(`          placeholder="${p.placeholder}"`);
        jsx.push(`          value={${p.variableName || 'inputVal'}}`);
        jsx.push(`          onChangeText={set${cap(p.variableName || 'InputVal')}}`);
        jsx.push(`        />`);
        styles[sid] = { fontSize: p.fontSize, borderWidth: 1, borderColor: p.borderColor, backgroundColor: p.backgroundColor || '#fff', borderRadius: p.borderRadius, paddingHorizontal: p.paddingHorizontal, paddingVertical: 10, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;

      case 'View':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          <Text style={{ color: '#94a3b8', fontSize: 12 }}>${p.label || 'Container'}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor, height: p.height, borderRadius: p.borderRadius, padding: p.padding, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight, justifyContent: 'center' };
        break;

      case 'Card':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          <Text style={styles.${sid}Title}>${p.title}</Text>`);
        jsx.push(`          <Text style={styles.${sid}Desc}>${p.description}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor, borderRadius: p.borderRadius, padding: p.padding, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight, shadowColor: '#000', shadowOpacity: p.shadowOpacity, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 4 };
        styles[`${sid}Title`] = { fontSize: 17, fontWeight: 'bold', marginBottom: 6, color: '#0f172a' };
        styles[`${sid}Desc`] = { fontSize: 13, color: '#64748b', lineHeight: 20 };
        break;

      case 'SafeAreaView':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        if (p.title) jsx.push(`          <Text style={styles.${sid}Title}>${p.title}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor, paddingVertical: p.paddingVertical, paddingHorizontal: 16, alignItems: 'center' };
        if (p.title) styles[`${sid}Title`] = { color: '#ffffff', fontSize: 18, fontWeight: 'bold' };
        break;

      case 'Switch':
        rnImports.add('Switch'); rnImports.add('Text');
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState(false);`);
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          <Text style={styles.${sid}Label}>${p.label}</Text>`);
        jsx.push(`          <Switch value={${p.variableName || 'switchVal'}} onValueChange={set${cap(p.variableName || 'SwitchVal')}} trackColor={{ true: '${p.trackColor}' }} />`);
        jsx.push(`        </View>`);
        styles[sid] = { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        styles[`${sid}Label`] = { fontSize: 16 };
        break;

      case 'Slider':
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState(${p.value});`);
        jsx.push(`        {/* Slider — npx expo install @react-native-community/slider */}`);
        jsx.push(`        {/* import Slider from '@react-native-community/slider'; */}`);
        jsx.push(`        {/* <Slider minimumValue={${p.minimumValue}} maximumValue={${p.maximumValue}} value={${p.variableName || p.value}} onValueChange={set${cap(p.variableName || 'SliderVal')}} minimumTrackTintColor="${p.minimumTrackTintColor}" style={styles.${sid}} /> */}`);
        styles[sid] = { marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;

      case 'Icon':
        iconLibs.add(p.library || 'AntDesign');
        jsx.push(`        <${p.library || 'AntDesign'} name="${p.name}" size={${p.size}} color="${p.color}" style={styles.${sid}} />`);
        styles[sid] = { marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        break;

      case 'Divider':
        jsx.push(`        <View style={styles.${sid}} />`);
        styles[sid] = { height: p.thickness, backgroundColor: p.color, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;

      case 'Avatar': {
        rnImports.add('Text');
        const initials = (p.name || '').split(' ').map(n => n[0] || '').slice(0, 2).join('').toUpperCase();
        jsx.push(`        <View style={styles.${sid}}>`);
        if (p.source) {
          rnImports.add('Image');
          jsx.push(`          <Image source={{ uri: '${p.source}' }} style={styles.${sid}Img} />`);
        } else {
          jsx.push(`          <Text style={styles.${sid}Txt}>${initials}</Text>`);
        }
        jsx.push(`        </View>`);
        styles[sid] = { width: p.size, height: p.size, borderRadius: p.borderRadius || p.size / 2, backgroundColor: p.backgroundColor, alignItems: 'center', justifyContent: 'center', marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        if (p.source) styles[`${sid}Img`] = { width: p.size, height: p.size, borderRadius: p.borderRadius || p.size / 2 };
        else styles[`${sid}Txt`] = { color: p.textColor, fontSize: Math.round(p.size * 0.38), fontWeight: 'bold' };
        break;
      }

      case 'Badge':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          <Text style={styles.${sid}T}>${p.text}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        styles[`${sid}T`] = { color: p.textColor, fontSize: p.fontSize, fontWeight: 'bold' };
        break;

      case 'Chip':
        rnImports.add('TouchableOpacity'); rnImports.add('Text');
        jsx.push(`        <TouchableOpacity style={styles.${sid}} activeOpacity={0.8}>`);
        jsx.push(`          <Text style={styles.${sid}T}>${p.label}</Text>`);
        jsx.push(`        </TouchableOpacity>`);
        styles[sid] = { backgroundColor: p.backgroundColor, borderRadius: p.borderRadius, paddingHorizontal: p.paddingH || 12, paddingVertical: p.paddingV || 5, alignSelf: 'flex-start', marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        styles[`${sid}T`] = { color: p.textColor, fontSize: p.fontSize, fontWeight: '600' };
        break;

      case 'ProgressBar':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        if (p.showLabel) {
          jsx.push(`          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>`);
          jsx.push(`            <Text style={{ fontSize: 11, color: '#666' }}>${p.label}</Text>`);
          jsx.push(`            <Text style={{ fontSize: 11, fontWeight: 'bold', color: '${p.color}' }}>{Math.round(${p.progress * 100})}%</Text>`);
          jsx.push(`          </View>`);
        }
        jsx.push(`          <View style={styles.${sid}Track}>`);
        jsx.push(`            <View style={[styles.${sid}Fill, { width: '${Math.round(p.progress * 100)}%' }]} />`);
        jsx.push(`          </View>`);
        jsx.push(`        </View>`);
        styles[sid] = { marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        styles[`${sid}Track`] = { height: p.height, borderRadius: p.borderRadius, backgroundColor: p.trackColor, overflow: 'hidden' };
        styles[`${sid}Fill`] = { height: '100%', backgroundColor: p.color, borderRadius: p.borderRadius };
        break;

      case 'Rating': {
        rnImports.add('Text');
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState(${p.defaultRating});`);
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          {Array.from({ length: ${p.maxRating} }).map((_, i) => (`);
        jsx.push(`            <Text key={i} style={{ fontSize: ${Math.round(p.size * 0.8)}, color: i < ${p.variableName || p.defaultRating} ? '${p.activeColor}' : '${p.inactiveColor}' }} onPress={() => set${cap(p.variableName || 'Rating')}(i + 1)}>★</Text>`);
        jsx.push(`          ))}`);
        jsx.push(`        </View>`);
        styles[sid] = { flexDirection: 'row', gap: 4, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        break;
      }

      case 'Checkbox':
        rnImports.add('TouchableOpacity'); rnImports.add('Text');
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState(${p.checked});`);
        jsx.push(`        <TouchableOpacity style={styles.${sid}} onPress={() => set${cap(p.variableName || 'IsChecked')}(v => !v)} activeOpacity={0.8}>`);
        jsx.push(`          <View style={[styles.${sid}Box, ${p.variableName || p.checked} && { backgroundColor: '${p.checkColor}', borderColor: '${p.checkColor}' }]}>`);
        jsx.push(`            {${p.variableName || p.checked} && <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}`);
        jsx.push(`          </View>`);
        jsx.push(`          <Text style={styles.${sid}Label}>${p.label}</Text>`);
        jsx.push(`        </TouchableOpacity>`);
        styles[sid] = { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft };
        styles[`${sid}Box`] = { width: 20, height: 20, borderRadius: 5, borderWidth: 2, borderColor: p.borderColor, alignItems: 'center', justifyContent: 'center' };
        styles[`${sid}Label`] = { fontSize: p.fontSize };
        break;

      case 'FAB':
        rnImports.add('TouchableOpacity'); rnImports.add('Text');
        jsx.push(`        <TouchableOpacity style={styles.${sid}} activeOpacity={0.8}>`);
        jsx.push(`          <Text style={{ color: '${p.iconColor}', fontSize: 28, fontWeight: 'bold' }}>+</Text>`);
        jsx.push(`        </TouchableOpacity>`);
        styles[sid] = { position: 'absolute', bottom: p.bottomOffset || 24, right: p.rightOffset || 24, width: p.size, height: p.size, borderRadius: p.size / 2, backgroundColor: p.backgroundColor, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8 };
        break;

      case 'Sound':
        jsx.push(`        {/* Player de Som — npx expo install expo-av */}`);
        jsx.push(`        {/* import { Audio } from 'expo-av'; */}`);
        jsx.push(`        {/* useEffect: const { sound } = await Audio.Sound.createAsync({ uri: '${p.sourceUrl}' }); */}`);
        jsx.push(`        <View style={styles.${sid}}>`);
        rnImports.add('Text');
        jsx.push(`          <Text style={{ color: '${p.textColor || '#fff'}', fontSize: 14, fontWeight: 'bold' }}>${p.title}</Text>`);
        jsx.push(`          <Text style={{ color: 'rgba(255,255,255,.55)', fontSize: 11 }}>${p.artist}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor || '#1e293b', borderRadius: 14, padding: 16, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;

      case 'Video':
        jsx.push(`        {/* Player de Vídeo — npx expo install expo-av */}`);
        jsx.push(`        {/* import { Video } from 'expo-av'; */}`);
        jsx.push(`        {/* <Video source={{ uri: '${p.sourceUrl}' }} style={styles.${sid}} useNativeControls resizeMode="contain" /> */}`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'Camera':
        jsx.push(`        {/* Câmera — npx expo install expo-camera */}`);
        jsx.push(`        {/* import { CameraView, useCameraPermissions } from 'expo-camera'; */}`);
        jsx.push(`        {/* const [permission, requestPermission] = useCameraPermissions(); */}`);
        jsx.push(`        {/* <CameraView style={styles.${sid}} facing="${p.facing}"> */}`);
        jsx.push(`        {/*   {captureButton} */}`);
        jsx.push(`        {/* </CameraView> */}`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'QRScanner':
        jsx.push(`        {/* Scanner QR — npx expo install expo-camera */}`);
        jsx.push(`        {/* import { CameraView, useCameraPermissions } from 'expo-camera'; */}`);
        jsx.push(`        {/* <CameraView style={styles.${sid}} barcodeScannerSettings={{ barcodeTypes: ['qr','code128'] }} onBarcodeScanned={({ data }) => set${cap(p.variableName || 'ScannedData')}(data)} /> */}`);
        if (p.variableName) stateVars.push(`  const [${p.variableName}, set${cap(p.variableName)}] = useState('');`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'FaceCamera':
        jsx.push(`        {/* Câmera + Face — npx expo install expo-camera */}`);
        jsx.push(`        {/* import { CameraView } from 'expo-camera'; */}`);
        jsx.push(`        {/* <CameraView style={styles.${sid}} facing="${p.facing}"> */}`);
        jsx.push(`        {/*   {/* Adicione expo-face-detector para detecção facial */}`);
        jsx.push(`        {/* </CameraView> */}`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'MapView':
        jsx.push(`        {/* Mapa GPS — npx expo install react-native-maps */}`);
        jsx.push(`        {/* import MapView, { Marker } from 'react-native-maps'; */}`);
        jsx.push(`        {/* <MapView`);
        jsx.push(`        {/*   style={styles.${sid}}`);
        jsx.push(`        {/*   initialRegion={{ latitude: ${p.latitude}, longitude: ${p.longitude}, latitudeDelta: ${p.latitudeDelta}, longitudeDelta: ${p.longitudeDelta} }}`);
        jsx.push(`        {/*   showsUserLocation={${p.showsUserLocation}}`);
        jsx.push(`        {/* >`);
        jsx.push(`        {/*   <Marker coordinate={{ latitude: ${p.latitude}, longitude: ${p.longitude} }} title="${p.markerTitle}" />`);
        jsx.push(`        {/* </MapView> */}`);
        styles[sid] = { width: '100%', height: p.height, marginTop: p.marginTop, marginBottom: p.marginBottom };
        break;

      case 'WeatherWidget': {
        rnImports.add('Text'); rnImports.add('ActivityIndicator');
        stateVars.push(`  const [weather${idx}, setWeather${idx}] = useState(null);`);
        effects.push(`  useEffect(() => {`);
        effects.push(`    fetch('https://api.open-meteo.com/v1/forecast?latitude=${p.latitude}&longitude=${p.longitude}&current_weather=true')`);
        effects.push(`      .then(r => r.json()).then(d => setWeather${idx}(d.current_weather)).catch(console.error);`);
        effects.push(`  }, []);`);
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          {weather${idx} ? (`);
        jsx.push(`            <>`);
        jsx.push(`              <Text style={{ color: '${p.textColor || '#fff'}', fontSize: 12, opacity: 0.8 }}>${p.city}</Text>`);
        jsx.push(`              <Text style={{ color: '${p.textColor || '#fff'}', fontSize: 40, fontWeight: 'bold' }}>{weather${idx}.temperature}°C</Text>`);
        jsx.push(`              <Text style={{ color: '${p.textColor || '#fff'}', fontSize: 12 }}>Vento: {weather${idx}.windspeed} km/h</Text>`);
        jsx.push(`            </>`);
        jsx.push(`          ) : <ActivityIndicator color="${p.textColor || '#fff'}" />}`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor || '#0ea5e9', borderRadius: p.borderRadius || 16, padding: 20, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight };
        break;
      }

      case 'ChatGPT': {
        rnImports.add('Text'); rnImports.add('TextInput'); rnImports.add('TouchableOpacity'); rnImports.add('FlatList');
        stateVars.push(`  const [messages${idx}, setMessages${idx}] = useState([{ role: 'assistant', content: 'Olá! Como posso ajudar?' }]);`);
        stateVars.push(`  const [input${idx}, setInput${idx}] = useState('');`);
        stateVars.push(`  const [loading${idx}, setLoading${idx}] = useState(false);`);
        jsx.push(`        {/* ChatGPT — OpenAI Chat Completion */}`);
        jsx.push(`        <View style={styles.${sid}}>`);
        jsx.push(`          <FlatList`);
        jsx.push(`            data={messages${idx}}`);
        jsx.push(`            keyExtractor={(_, i) => String(i)}`);
        jsx.push(`            renderItem={({ item }) => (`);
        jsx.push(`              <View style={{ alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: item.role === 'user' ? '${p.bgUser || '#10a37f'}' : '${p.bgAssistant || '#f3f4f6'}', padding: 10, borderRadius: 12, marginVertical: 3, maxWidth: '80%' }}>`);
        jsx.push(`                <Text style={{ color: item.role === 'user' ? '#fff' : '#000' }}>{item.content}</Text>`);
        jsx.push(`              </View>`);
        jsx.push(`            )}`);
        jsx.push(`            style={{ flex: 1, padding: 10 }}`);
        jsx.push(`          />`);
        jsx.push(`          <View style={{ flexDirection: 'row', padding: 10, gap: 8 }}>`);
        jsx.push(`            <TextInput style={{ flex: 1, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 }} value={input${idx}} onChangeText={setInput${idx}} placeholder="${p.placeholder || 'Digite...'}" />`);
        jsx.push(`            <TouchableOpacity`);
        jsx.push(`              style={{ backgroundColor: '${p.accentColor || '#10a37f'}', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'center' }}`);
        jsx.push(`              onPress={async () => {`);
        jsx.push(`                if (!input${idx}.trim() || loading${idx}) return;`);
        jsx.push(`                const userMsg = { role: 'user', content: input${idx} };`);
        jsx.push(`                setMessages${idx}(prev => [...prev, userMsg]);`);
        jsx.push(`                setInput${idx}(''); setLoading${idx}(true);`);
        jsx.push(`                try {`);
        jsx.push(`                  const res = await fetch('https://api.openai.com/v1/chat/completions', {`);
        jsx.push(`                    method: 'POST',`);
        jsx.push(`                    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ${p.apiKey || 'SUA_OPENAI_KEY'}' },`);
        jsx.push(`                    body: JSON.stringify({ model: '${p.model || 'gpt-4o-mini'}', messages: [{ role: 'system', content: '${p.systemPrompt || 'Seja útil.'}' }, ...messages${idx}, userMsg] })`);
        jsx.push(`                  });`);
        jsx.push(`                  const data = await res.json();`);
        jsx.push(`                  setMessages${idx}(prev => [...prev, data.choices[0].message]);`);
        jsx.push(`                } catch (e) { console.error(e); } finally { setLoading${idx}(false); }`);
        jsx.push(`              }}`);
        jsx.push(`            >`);
        jsx.push(`              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enviar</Text>`);
        jsx.push(`            </TouchableOpacity>`);
        jsx.push(`          </View>`);
        jsx.push(`        </View>`);
        styles[sid] = { flex: 1, backgroundColor: p.backgroundColor || '#ffffff', marginTop: p.marginTop, marginBottom: p.marginBottom, minHeight: 300 };
        break;
      }

      default:
        jsx.push(`        {/* ${el.type}: componente não suportado no gerador — adicione manualmente */}`);
        break;
    }
  });

  const rnList = [...rnImports].join(', ');
  const iconImports = [...iconLibs].map(lib => `import { ${lib} } from '@expo/vector-icons';`).join('\n');
  const hasNav = allScreens.length > 1;
  const needsState = stateVars.length > 0 || effects.length > 0;

  const stylesCode = Object.entries(styles).map(([key, val]) => {
    return `  ${key}: {\n${styleBlock(val)}\n  },`;
  }).join('\n');

  const importsLine = needsState
    ? `import React, { useState${effects.length > 0 ? ', useEffect' : ''} } from 'react';`
    : `import React from 'react';`;

  return `${importsLine}
import { ${rnList} } from 'react-native';${iconImports ? '\n' + iconImports : ''}

export default function ${safe(screen.name)}Screen({ ${hasNav ? 'navigation' : ''} }) {
${stateVars.join('\n')}
${effects.length > 0 ? '\n' + effects.join('\n') : ''}
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
${jsx.join('\n')}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
${stylesCode}
});
`;
}

export function downloadScreenFile(screen, allScreens) {
  const code = genScreenCode(screen, allScreens);
  const name = (screen.name || 'Screen').replace(/\s+/g, '');
  const blob = new Blob([code], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.jsx`;
  a.click();
  URL.revokeObjectURL(url);
}

function fileTree(project) {
  const appName = safe(project.name) || 'MeuApp';
  const screens = project.screens.map(s => `  │   ├── ${safe(s.name)}.jsx`).join('\n');
  return `${appName}/
  ├── App.js                    ← Ponto de entrada + Navegação
  ├── app.json                  ← Configurações do app
  ├── eas.json                  ← Configurações de build
  ├── package.json
  ├── assets/
  │   ├── icon.png              ← Ícone do app (1024x1024)
  │   ├── splash.png            ← Tela de carregamento
  │   └── adaptive-icon.png     ← Ícone Android adaptativo
  └── screens/
${screens}`;
}

export function generateExpoProject(project) {
  const slides = [];
  const appName = safe(project.name) || 'MeuApp';
  const needsNav = project.screens.length > 1;
  const hasIcons = project.screens.some(s => (s.elements || []).some(e => e.type === 'Icon'));

  slides.push({
    step: 1, icon: 'CheckSquare',
    title: 'Pré-requisitos',
    description: 'Antes de começar, verifique se você tem as ferramentas instaladas no seu computador.',
    file: null, language: 'bash',
    code: `# 1. Instalar Node.js LTS (versão 18 ou superior)
# Baixe em: https://nodejs.org

# 2. Verificar versão instalada
node --version
npm --version

# 3. Instalar o Expo CLI globalmente
npm install -g expo-cli

# 4. Instalar o EAS CLI (para builds e publicação)
npm install -g eas-cli

# 5. Criar uma conta gratuita em expo.dev
# Acesse: https://expo.dev/signup

# 6. Fazer login no terminal
eas login`,
  });

  slides.push({
    step: 2, icon: 'Rocket',
    title: 'Criar o Projeto Expo',
    description: 'Crie um novo projeto usando o template em branco do Expo. Este comando gera toda a estrutura inicial.',
    file: null, language: 'bash',
    code: `# Criar o projeto (escolha "blank" no menu interativo)
npx create-expo-app ${appName} --template blank

# Entrar na pasta do projeto
cd ${appName}

# Verificar que tudo foi criado corretamente
ls`,
  });

  slides.push({
    step: 3, icon: 'FolderOpen',
    title: 'Estrutura do Projeto',
    description: 'Entenda cada pasta e arquivo do projeto. Você irá criar a pasta "screens/" para organizar suas telas.',
    file: 'Estrutura de pastas', language: 'bash',
    code: fileTree(project),
  });

  const deps = [];
  if (needsNav) deps.push('@react-navigation/native', '@react-navigation/stack', 'react-native-screens', 'react-native-safe-area-context', 'react-native-gesture-handler');
  if (hasIcons) deps.push('@expo/vector-icons');
  const hasCamera = project.screens.some(s => (s.elements || []).some(e => ['Camera','QRScanner','FaceCamera'].includes(e.type)));
  const hasMap = project.screens.some(s => (s.elements || []).some(e => e.type === 'MapView'));
  const hasAV = project.screens.some(s => (s.elements || []).some(e => ['Sound','Video'].includes(e.type)));
  if (hasCamera) deps.push('expo-camera');
  if (hasMap) deps.push('react-native-maps');
  if (hasAV) deps.push('expo-av');

  slides.push({
    step: 4, icon: 'Package',
    title: 'Instalar Dependências',
    description: 'Instale as bibliotecas necessárias para o projeto. O comando "expo install" garante versões compatíveis.',
    file: null, language: 'bash',
    code: deps.length > 0
      ? `# Instalar dependências do projeto
npx expo install ${deps.join(' ')}

# Bibliotecas extras populares (conforme necessidade):
npx expo install expo-image-picker     # Seleção de fotos
npx expo install expo-secure-store     # Armazenamento seguro
npx expo install expo-notifications    # Notificações push`
      : `# Instalar recursos extras populares (opcional):
npx expo install expo-image-picker     # Seleção de fotos
npx expo install expo-secure-store     # Armazenamento seguro
npx expo install expo-notifications    # Notificações push
npx expo install expo-camera           # Câmera`,
  });

  slides.push({
    step: 5, icon: 'Settings',
    title: 'Configurar app.json',
    description: 'O app.json define as informações do seu aplicativo como nome, ícone e identificadores para as lojas.',
    file: 'app.json', language: 'json',
    code: JSON.stringify({
      expo: {
        name: project.name,
        slug: appName.toLowerCase(),
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        splash: { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
        android: {
          adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
          package: `com.seudominio.${appName.toLowerCase()}`,
        },
        ios: {
          bundleIdentifier: `com.seudominio.${appName.toLowerCase()}`,
          supportsTablet: true,
        },
        extra: { eas: { projectId: 'SEU-PROJECT-ID-AQUI' } },
      },
    }, null, 2),
  });

  if (needsNav) {
    const imports = project.screens.map(s => `import ${safe(s.name)}Screen from './screens/${safe(s.name)}';`).join('\n');
    const screensList = project.screens.map(s => `      <Stack.Screen\n        name="${s.name}"\n        component={${safe(s.name)}Screen}\n        options={{ title: '${s.name}' }}\n      />`).join('\n');
    slides.push({
      step: 6, icon: 'Map',
      title: 'Configurar Navegação (App.js)',
      description: 'Configure o sistema de navegação entre telas. O Stack Navigator empilha as telas como uma pilha de cartas.',
      file: 'App.js', language: 'javascript',
      code: `import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
${imports}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="${project.screens[0].name}"
        screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
${screensList}
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
    });
  } else {
    slides.push({
      step: 6, icon: 'Map',
      title: 'Arquivo Principal (App.js)',
      description: 'O App.js é o ponto de entrada do aplicativo. Como há apenas uma tela, não é necessário um navegador.',
      file: 'App.js', language: 'javascript',
      code: `import React from 'react';
import ${safe(project.screens[0]?.name || 'Home')}Screen from './screens/${safe(project.screens[0]?.name || 'Home')}';

export default function App() {
  return <${safe(project.screens[0]?.name || 'Home')}Screen />;
}`,
    });
  }

  project.screens.forEach((screen, idx) => {
    slides.push({
      step: 6 + idx + 1, icon: 'Smartphone',
      title: `Tela: ${screen.name}`,
      description: `Crie o arquivo screens/${safe(screen.name)}.jsx e cole o código gerado. Clique em "⬇ Download" para baixar o arquivo diretamente.`,
      file: `screens/${safe(screen.name)}.jsx`, language: 'javascript',
      code: genScreenCode(screen, project.screens),
      screen: screen,
      allScreens: project.screens,
    });
  });

  const nextStep = 6 + project.screens.length + 1;

  slides.push({
    step: nextStep, icon: 'Smartphone',
    title: 'Testar com Expo Go',
    description: 'Execute o projeto e teste em tempo real no seu celular. Instale o app "Expo Go" na Play Store ou App Store e escaneie o QR Code.',
    file: null, language: 'bash',
    code: `# Iniciar o servidor de desenvolvimento
npx expo start

# Opções disponíveis no terminal:
#   Pressione "a" → Abre no emulador Android
#   Pressione "i" → Abre no simulador iOS (apenas macOS)
#   Pressione "w" → Abre no navegador web

# No celular:
# 1. Instale o app "Expo Go" (Play Store / App Store)
# 2. Abra o Expo Go
# 3. Escaneie o QR Code exibido no terminal
# 4. Seu app será carregado automaticamente!

# Dica: Ao salvar um arquivo, o app atualiza instantaneamente
# Isso chama-se "Hot Reload" — uma das vantagens do Expo!`,
  });

  slides.push({
    step: nextStep + 1, icon: 'Settings',
    title: 'Configurar EAS Build',
    description: 'O EAS (Expo Application Services) é o sistema oficial para compilar seu app em APK ou AAB para distribuição nas lojas.',
    file: 'eas.json', language: 'json',
    code: `# 1. Inicializar o EAS no projeto (execute uma vez)
eas build:configure

{
  "cli": { "version": ">= 5.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "android": { "buildType": "app-bundle" } }
  },
  "submit": { "production": {} }
}`,
  });

  slides.push({
    step: nextStep + 2, icon: 'Download',
    title: 'Gerar APK (Android)',
    description: 'O perfil "preview" gera um arquivo APK que pode ser instalado diretamente em qualquer Android. Ideal para testes com usuários reais antes de publicar.',
    file: null, language: 'bash',
    code: `# Gerar APK para distribuição interna / testes
eas build --platform android --profile preview

# O processo irá:
# 1. Fazer upload do código para os servidores Expo
# 2. Compilar o APK na nuvem (5-15 minutos)
# 3. Disponibilizar o link para download

# Após concluir, você recebe um link como:
# https://expo.dev/artifacts/eas/xxxxx.apk

# Como instalar no celular Android:
# 1. Transfira o APK para o celular
# 2. Ative "Fontes desconhecidas" nas configurações
# 3. Abra o arquivo APK e instale`,
  });

  slides.push({
    step: nextStep + 3, icon: 'Globe',
    title: 'Publicar na Play Store',
    description: 'Com o AAB em mãos, siga este roteiro para publicar seu app. O processo leva de 1 a 3 dias para aprovação do Google.',
    file: null, language: 'bash',
    code: `# === PUBLICAR NA GOOGLE PLAY STORE ===

# 1. CRIAR CONTA DE DESENVOLVEDOR
#    Acesse: https://play.google.com/console
#    Taxa única: US$ 25

# 2. CRIAR NOVO APP NO CONSOLE
#    Nome: "${project.name}"

# 3. GERAR AAB PARA PRODUÇÃO
eas build --platform android --profile production

# 4. FAZER UPLOAD NO CONSOLE
#    Produção > Criar nova versão > Upload do .aab

# 5. PREENCHER INFORMAÇÕES OBRIGATÓRIAS
#    - Ícone 512x512, screenshots, descrição

# 6. ENVIAR PARA REVISÃO
#    Aprovação: 1 a 3 dias úteis

# === PUBLICAR AUTOMATICAMENTE COM EAS ===
eas submit --platform android --latest`,
  });

  slides.push({
    step: nextStep + 4, icon: 'Star',
    title: 'Parabéns! Próximos Passos',
    description: 'Seu app está pronto para o mundo! Confira recursos para continuar evoluindo como desenvolvedor.',
    file: null, language: 'bash',
    code: `# === RECURSOS PARA CONTINUAR APRENDENDO ===

# Documentação oficial:
# Expo Docs:         https://docs.expo.dev
# React Native:      https://reactnative.dev/docs
# React Navigation:  https://reactnavigation.org

# === BOAS PRÁTICAS ===

# 1. Controle de versão (Git)
git init
git add .
git commit -m "feat: versão inicial do ${project.name}"

# 2. Monitorar erros em produção
npx expo install sentry-expo

# 3. Versionamento semântico
# "version": "1.0.0"  → Major.Minor.Patch

# === CHECKLIST ANTES DE PUBLICAR ===
# [ ] Ícone do app definido (1024x1024)
# [ ] Tela de splash configurada
# [ ] Nome e descrição revisados
# [ ] Screenshots capturadas
# [ ] Backup da keystore realizado
# [ ] Testado em dispositivo real`,
  });

  return slides;
}
