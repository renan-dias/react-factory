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
        jsx.push(`        {/* Instale: npx expo install @react-native-community/slider */}`);
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
      case 'SafeAreaView':
        rnImports.add('Text');
        jsx.push(`        <View style={styles.${sid}}>`);
        if (p.title) jsx.push(`          <Text style={styles.${sid}Title}>${p.title}</Text>`);
        jsx.push(`        </View>`);
        styles[sid] = { backgroundColor: p.backgroundColor, paddingVertical: p.paddingVertical, paddingHorizontal: 16, alignItems: 'center' };
        if (p.title) styles[`${sid}Title`] = { color: '#ffffff', fontSize: 18, fontWeight: 'bold' };
        break;
      default: break;
    }
  });

  const rnList = [...rnImports].join(', ');
  const iconImports = [...iconLibs].map(lib => `import { ${lib} } from '@expo/vector-icons';`).join('\n');
  const hasNav = allScreens.length > 1;
  const needsState = stateVars.length > 0;

  const stylesCode = Object.entries(styles).map(([key, val]) => {
    return `  ${key}: {\n${styleBlock(val)}\n  },`;
  }).join('\n');

  return `import React${needsState ? ', { useState }' : ''} from 'react';
import { ${rnList} } from 'react-native';${iconImports ? '\n' + iconImports : ''}

export default function ${safe(screen.name)}Screen({ ${hasNav ? 'navigation' : ''} }) {
${stateVars.join('\n')}
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

  // ─── 1. Pré-requisitos ───────────────────────────────────────
  slides.push({
    step: 1, icon: 'CheckSquare',
    title: 'Pré-requisitos',
    description: 'Antes de começar, verifique se você tem as ferramentas instaladas no seu computador.',
    file: null,
    language: 'bash',
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

  // ─── 2. Criar Projeto ────────────────────────────────────────
  slides.push({
    step: 2, icon: 'Rocket',
    title: 'Criar o Projeto Expo',
    description: 'Crie um novo projeto usando o template em branco do Expo. Este comando gera toda a estrutura inicial.',
    file: null,
    language: 'bash',
    code: `# Criar o projeto (escolha "blank" no menu interativo)
npx create-expo-app ${appName} --template blank

# Entrar na pasta do projeto
cd ${appName}

# Verificar que tudo foi criado corretamente
ls`,
  });

  // ─── 3. Estrutura do Projeto ─────────────────────────────────
  slides.push({
    step: 3, icon: 'FolderOpen',
    title: 'Estrutura do Projeto',
    description: 'Entenda cada pasta e arquivo do projeto. Você irá criar a pasta "screens/" para organizar suas telas.',
    file: 'Estrutura de pastas',
    language: 'bash',
    code: fileTree(project),
  });

  // ─── 4. Instalar Dependências ────────────────────────────────
  const deps = [];
  if (needsNav) deps.push('@react-navigation/native', '@react-navigation/stack', 'react-native-screens', 'react-native-safe-area-context', 'react-native-gesture-handler');
  if (hasIcons) deps.push('@expo/vector-icons');

  slides.push({
    step: 4, icon: 'Package',
    title: 'Instalar Dependências',
    description: 'Instale as bibliotecas necessárias para o projeto. O comando "expo install" garante versões compatíveis.',
    file: null,
    language: 'bash',
    code: deps.length > 0
      ? `# Instalar dependências de navegação e recursos
npx expo install ${deps.join(' ')}

# Se precisar de mais bibliotecas populares:
npx expo install expo-image-picker     # Seleção de fotos
npx expo install expo-secure-store     # Armazenamento seguro
npx expo install expo-notifications    # Notificações push
npx expo install expo-camera           # Câmera`
      : `# Instalar recursos extras populares (opcional):
npx expo install expo-image-picker     # Seleção de fotos
npx expo install expo-secure-store     # Armazenamento seguro
npx expo install expo-notifications    # Notificações push
npx expo install expo-camera           # Câmera`,
  });

  // ─── 5. app.json ─────────────────────────────────────────────
  slides.push({
    step: 5, icon: 'Settings',
    title: 'Configurar app.json',
    description: 'O app.json define as informações do seu aplicativo como nome, ícone e identificadores para as lojas.',
    file: 'app.json',
    language: 'json',
    code: JSON.stringify({
      expo: {
        name: project.name,
        slug: appName.toLowerCase(),
        version: '1.0.0',
        orientation: 'portrait',
        icon: './assets/icon.png',
        userInterfaceStyle: 'automatic',
        splash: {
          image: './assets/splash.png',
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
        android: {
          adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff',
          },
          package: `com.seudominio.${appName.toLowerCase()}`,
        },
        ios: {
          bundleIdentifier: `com.seudominio.${appName.toLowerCase()}`,
          supportsTablet: true,
        },
        extra: {
          eas: { projectId: 'SEU-PROJECT-ID-AQUI' },
        },
      },
    }, null, 2),
  });

  // ─── 6. Navegação / App.js ───────────────────────────────────
  if (needsNav) {
    const imports = project.screens.map(s => `import ${safe(s.name)}Screen from './screens/${safe(s.name)}';`).join('\n');
    const screens = project.screens.map(s => `      <Stack.Screen\n        name="${s.name}"\n        component={${safe(s.name)}Screen}\n        options={{ title: '${s.name}' }}\n      />`).join('\n');
    slides.push({
      step: 6, icon: 'Map',
      title: 'Configurar Navegação (App.js)',
      description: 'Configure o sistema de navegação entre telas. O Stack Navigator empilha as telas como uma pilha de cartas.',
      file: 'App.js',
      language: 'javascript',
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
${screens}
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
      file: 'App.js',
      language: 'javascript',
      code: `import React from 'react';
import ${safe(project.screens[0]?.name || 'Home')}Screen from './screens/${safe(project.screens[0]?.name || 'Home')}';

export default function App() {
  return <${safe(project.screens[0]?.name || 'Home')}Screen />;
}`,
    });
  }

  // ─── Slides de Telas ─────────────────────────────────────────
  project.screens.forEach((screen, idx) => {
    slides.push({
      step: 6 + idx + 1, icon: 'Smartphone',
      title: `Tela: ${screen.name}`,
      description: `Crie o arquivo screens/${safe(screen.name)}.jsx e cole o código gerado. Cada propriedade no StyleSheet corresponde a uma configuração que você definiu no construtor.`,
      file: `screens/${safe(screen.name)}.jsx`,
      language: 'javascript',
      code: genScreenCode(screen, project.screens),
    });
  });

  const nextStep = 6 + project.screens.length + 1;

  // ─── Testar com Expo Go ──────────────────────────────────────
  slides.push({
    step: nextStep, icon: 'Smartphone',
    title: 'Testar com Expo Go',
    description: 'Execute o projeto e teste em tempo real no seu celular. Instale o app "Expo Go" na Play Store ou App Store e escaneie o QR Code.',
    file: null,
    language: 'bash',
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

  // ─── Configurar EAS Build ────────────────────────────────────
  slides.push({
    step: nextStep + 1, icon: 'Settings',
    title: 'Configurar EAS Build',
    description: 'O EAS (Expo Application Services) é o sistema oficial para compilar seu app em APK ou AAB para distribuição nas lojas.',
    file: 'eas.json',
    language: 'json',
    code: `# 1. Inicializar o EAS no projeto (execute uma vez)
eas build:configure

# Isso cria o arquivo eas.json automaticamente.
# Conteúdo do eas.json gerado:

{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}`,
  });

  // ─── Build APK ───────────────────────────────────────────────
  slides.push({
    step: nextStep + 2, icon: 'Download',
    title: 'Gerar APK (Android)',
    description: 'O perfil "preview" gera um arquivo APK que pode ser instalado diretamente em qualquer Android. Ideal para testes com usuários reais antes de publicar.',
    file: null,
    language: 'bash',
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
#    (Configurações > Segurança > Fontes desconhecidas)
# 3. Abra o arquivo APK e instale

# Verificar status dos seus builds:
eas build:list`,
  });

  // ─── Build AAB Play Store ─────────────────────────────────────
  slides.push({
    step: nextStep + 3, icon: 'Package',
    title: 'Build para Play Store (AAB)',
    description: 'O perfil "production" gera um AAB (Android App Bundle), o formato exigido pelo Google Play Store. É menor e mais otimizado que um APK.',
    file: null,
    language: 'bash',
    code: `# Gerar AAB para publicação na Play Store
eas build --platform android --profile production

# Diferença entre APK e AAB:
# APK  → Arquivo completo, instala diretamente no celular
# AAB  → Otimizado para Play Store, Google distribui por partes

# O EAS gerencia automaticamente a assinatura do app!
# Na primeira vez, ele pergunta:
#   "Generate a new keystore?" → Responda "Yes"
# O keystore fica guardado nos servidores da Expo com segurança.

# IMPORTANTE: Faça o download do keystore após o primeiro build!
eas credentials

# Selecione Android > Production > Keystore
# Clique em "Download" e guarde em local seguro!
# Sem o keystore você não pode atualizar seu app na Play Store.

# Ver build gerado:
eas build:list --platform android`,
  });

  // ─── Keystore / Chave de Assinatura ───────────────────────────
  slides.push({
    step: nextStep + 4, icon: 'Key',
    title: 'Chave de Assinatura (Keystore)',
    description: 'A keystore é a "assinatura digital" do seu app. Sem ela você não pode publicar atualizações. O EAS a gerencia automaticamente, mas você deve guardá-la.',
    file: 'keystore.jks (backup)',
    language: 'bash',
    code: `# === BACKUP DA KEYSTORE (MUITO IMPORTANTE!) ===

# Ver e baixar suas credenciais de assinatura:
eas credentials

# Selecione:
# > Android
# > com.seudominio.${appName.toLowerCase()} (production)
# > Keystore: Manage your Android Keystore
# > Download existing keystore

# Guarde os dados em local seguro:
# - Arquivo keystore.jks
# - Keystore password
# - Key alias
# - Key password

# === ALTERNATIVA: Criar Keystore Manual ===
# (Somente se quiser gerenciar manualmente)

keytool -genkey -v -keystore meu-app.keystore -alias meu-app -keyalg RSA -keysize 2048 -validity 10000

# Configurar no eas.json para usar keystore local:
# "android": {
#   "credentialsSource": "local"
# }

# === REGRA DE OURO ===
# Faça backup da keystore em pelo menos 3 lugares diferentes!
# (Pendrive, Google Drive, E-mail)
# Perder a keystore = não conseguir atualizar o app NUNCA MAIS.`,
  });

  // ─── Publicar na Play Store ───────────────────────────────────
  slides.push({
    step: nextStep + 5, icon: 'Globe',
    title: 'Publicar na Play Store',
    description: 'Com o AAB em mãos, siga este roteiro para publicar seu app. O processo leva de 1 a 3 dias para aprovação do Google.',
    file: null,
    language: 'bash',
    code: `# === PUBLICAR NA GOOGLE PLAY STORE ===

# 1. CRIAR CONTA DE DESENVOLVEDOR
#    Acesse: https://play.google.com/console
#    Taxa única: US$ 25 (pagamento único, não anual)
#    Aguarde até 48h para ativação da conta

# 2. CRIAR NOVO APP NO CONSOLE
#    > Todos os apps > Criar app
#    > Nome do app: "${project.name}"
#    > Idioma padrão: Português (Brasil)
#    > Tipo: App (não jogo)
#    > Gratuito ou pago?
#    > Aceite as políticas do desenvolvedor

# 3. PREENCHER INFORMAÇÕES OBRIGATÓRIAS
#    Ficha da Play Store (em: Presença na Play Store):
#    - Título do app (até 30 caracteres)
#    - Descrição curta (até 80 caracteres)
#    - Descrição completa (até 4000 caracteres)
#    - Ícone do app: 512x512 pixels (PNG)
#    - Gráfico de recursos: 1024x500 pixels
#    - Screenshots: mínimo 2 por tipo de dispositivo
#      Celular: 320x569 até 3840x2160 pixels

# 4. CONFIGURAR CLASSIFICAÇÃO INDICATIVA
#    > Classificação de conteúdo
#    > Preencha o questionário
#    > O Google classifica automaticamente

# 5. FAZER UPLOAD DO AAB
#    > Produção > Criar nova versão
#    > Faça upload do arquivo .aab gerado pelo EAS
#    > Adicione notas de versão (o que mudou)
#    > Salvar > Revisar versão > Publicar

# 6. ENVIAR PARA REVISÃO
#    O Google analisa em 1 a 3 dias úteis
#    Você recebe email com resultado

# === PUBLICAR COM EAS SUBMIT (AUTOMATIZADO) ===
# Configure as credenciais da Play Store e use:
eas submit --platform android --latest`,
  });

  // ─── Próximos Passos ─────────────────────────────────────────
  slides.push({
    step: nextStep + 6, icon: 'Star',
    title: 'Parabens! Proximos Passos',
    description: 'Seu app esta pronto para o mundo! Confira recursos para continuar evoluindo como desenvolvedor.',
    file: null,
    language: 'bash',
    code: `# === RECURSOS PARA CONTINUAR APRENDENDO ===

# Documentacao oficial:
# Expo Docs:            https://docs.expo.dev
# React Native:         https://reactnative.dev/docs
# React Navigation:     https://reactnavigation.org
# EAS Build:            https://docs.expo.dev/build/introduction

# === BOAS PRATICAS ===

# 1. Controle de versao (Git)
git init
git add .
git commit -m "feat: versao inicial do ${project.name}"

# 2. Usar TypeScript (recomendado para projetos grandes)
npx create-expo-app MeuApp --template blank-typescript

# 3. Testar em dispositivos reais antes de publicar
eas build --platform android --profile preview

# 4. Monitorar erros em producao
npx expo install sentry-expo
# Configure em: https://sentry.io

# 5. Versionamento semantico no app.json
# "version": "1.0.0"  → Major.Minor.Patch
# Major: mudancas incompativeis
# Minor: novas funcionalidades
# Patch: correcoes de bugs

# === CHECKLIST ANTES DE PUBLICAR ===
# [ ] Icone do app definido (1024x1024)
# [ ] Tela de splash configurada
# [ ] Nome e descricao revisados
# [ ] Screenshots capturadas
# [ ] Backup da keystore realizado
# [ ] Testado em dispositivo real
# [ ] Versao no app.json atualizada`,
  });

  return slides;
}
