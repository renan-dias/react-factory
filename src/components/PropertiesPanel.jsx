import React, { useState } from 'react';
import { Settings2, Layers, Plus, X, Smartphone, ExternalLink, Save, Package, Bookmark } from 'lucide-react';
import { useApp, COMPONENT_DEFS } from '../contexts/AppContext';

const PALETTE = ['#020817','#0f172a','#1e293b','#334155','#475569','#64748b','#94a3b8','#cbd5e1','#f1f5f9','#ffffff','#fef9c3','#fde68a','#f59e0b','#d97706','#92400e','#fecdd3','#f87171','#ef4444','#dc2626','#bbf7d0','#6ee7b7','#10b981','#059669','#bfdbfe','#93c5fd','#3b82f6','#2563eb','#ddd6fe','#c4b5fd','#8b5cf6','#7c3aed','#a78bfa','#6366f1','#4f46e5'];

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ display:'flex', gap:6, alignItems:'center', marginBottom:6 }}>
        <input type="color" className="prop-input-color" value={value||'#000000'} onChange={e => onChange(e.target.value)}/>
        <input className="prop-input" type="text" value={value||''} onChange={e => onChange(e.target.value)} style={{ flex:1, fontFamily:'var(--mono)', fontSize:11 }} placeholder="#000000"/>
      </div>
      <div className="color-swatches">
        {PALETTE.map(c => (
          <div key={c} className={`color-swatch${value===c?' selected':''}`} style={{ background:c, boxShadow:c==='#ffffff'?'inset 0 0 0 1px #e2e8f0':'none' }} onClick={() => onChange(c)} title={c}/>
        ))}
      </div>
    </div>
  );
}

const Row = ({ label, children }) => <div className="prop-row"><span className="prop-label">{label}</span>{children}</div>;
const Num = ({ label, value, onChange, min, max, step=1 }) => <Row label={label}><input className="prop-input" type="number" value={value} min={min} max={max} step={step} onChange={e => onChange(Number(e.target.value))}/></Row>;
const Sel = ({ label, value, options, onChange }) => <Row label={label}><select className="prop-select" value={value} onChange={e => onChange(e.target.value)}>{options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}</select></Row>;
const Txt = ({ label, value, onChange, placeholder, mono }) => <Row label={label}><input className="prop-input" value={value||''} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={mono?{fontFamily:'var(--mono)',fontSize:11}:{}}/></Row>;
const Margins = ({ p, onChange }) => (
  <div className="prop-group">
    <div className="prop-group-title">Espaçamento</div>
    <div className="margins-grid">
      {[['marginTop','Cima'],['marginBottom','Baixo'],['marginLeft','Esquerda'],['marginRight','Direita']].map(([k,l])=>(
        <div key={k} className="margin-field"><label>{l}</label><input className="prop-input" type="number" value={p[k]??0} style={{width:'100%'}} onChange={e=>onChange({[k]:Number(e.target.value)})}/></div>
      ))}
    </div>
  </div>
);

const ApiInfoBox = ({ def }) => (
  <div className="api-info-box">
    <div className="api-info-title">
      <span>🔗</span>
      {def.apiProvider}
      {!def.apiKey && <span style={{ marginLeft:'auto', fontSize:9, background:'var(--success)', color:'#fff', padding:'1px 6px', borderRadius:4, fontWeight:800 }}>GRÁTIS</span>}
      {def.apiKey && <span style={{ marginLeft:'auto', fontSize:9, background:'var(--accent2)', color:'#fff', padding:'1px 6px', borderRadius:4, fontWeight:800 }}>CHAVE</span>}
    </div>
    <div className="api-info-body">
      {def.apiKey ? 'Requer chave de API gratuita.' : 'Sem necessidade de chave de API.'}
      {' '}Documentação:
    </div>
    <a className="api-info-link" href={def.apiDocs} target="_blank" rel="noopener noreferrer" style={{ display:'flex', alignItems:'center', gap:4 }}>
      {def.apiDocs} <ExternalLink size={10}/>
    </a>
  </div>
);

const ICON_OPTS = [
  {name:'star',e:'★'},{name:'heart',e:'♥'},{name:'home',e:'⌂'},{name:'user',e:'◉'},{name:'search',e:'⊛'},
  {name:'settings',e:'⚙'},{name:'bell',e:'♪'},{name:'camera',e:'⊡'},{name:'phone',e:'☎'},{name:'mail',e:'✉'},
  {name:'check',e:'✓'},{name:'close',e:'✕'},{name:'plus',e:'+'},{name:'minus',e:'−'},{name:'arrow',e:'→'},
  {name:'share',e:'↑'},{name:'bookmark',e:'◈'},{name:'edit',e:'✎'},{name:'trash',e:'⊗'},{name:'info',e:'ℹ'},
  {name:'lock',e:'⊝'},{name:'map',e:'⊞'},{name:'location',e:'⊙'},{name:'calendar',e:'▦'},{name:'clock',e:'◷'},
  {name:'flag',e:'⚑'},{name:'chart',e:'▨'},{name:'music',e:'♫'},{name:'wifi',e:'▴'},{name:'battery',e:'▰'},
];

function AdvancedPositionGroup({ el, updateEl }) {
  const ap = el.advancedProps || { x:0, y:0, width:343, height:null };
  return (
    <div className="prop-group prop-group-advanced">
      <div className="prop-group-title" style={{ color:'var(--accent2)' }}>📐 Posição Avançada</div>
      <Num label="X (px)" value={Math.round(ap.x??0)} min={-200} max={1000} onChange={v => updateEl({ advancedProps:{...ap, x:v}})}/>
      <Num label="Y (px)" value={Math.round(ap.y??0)} min={-200} max={2000} onChange={v => updateEl({ advancedProps:{...ap, y:v}})}/>
      <Num label="Largura" value={Math.round(ap.width??343)} min={60} max={600} onChange={v => updateEl({ advancedProps:{...ap, width:v}})}/>
      {ap.height != null && <Num label="Altura" value={Math.round(ap.height)} min={20} max={1200} onChange={v => updateEl({ advancedProps:{...ap, height:v}})}/>}
    </div>
  );
}

function ElProps({ el, onChange, screens }) {
  const p = el.props;
  const def = COMPONENT_DEFS[el.type];

  switch (el.type) {
    case 'Text': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Conteúdo</div>
          <Row label="Texto"><textarea className="prop-input" value={p.text} rows={3} style={{resize:'vertical',fontSize:12}} onChange={e=>onChange({text:e.target.value})}/></Row>
        </div>
        <div className="prop-group"><div className="prop-group-title">Tipografia</div>
          <Num label="Tamanho" value={p.fontSize} min={8} max={72} onChange={v=>onChange({fontSize:v})}/>
          <Sel label="Peso" value={p.fontWeight} onChange={v=>onChange({fontWeight:v})} options={[{value:'normal',label:'Normal'},{value:'bold',label:'Negrito'},{value:'600',label:'Semi-bold'},{value:'300',label:'Leve'}]}/>
          <Sel label="Alinhamento" value={p.textAlign} onChange={v=>onChange({textAlign:v})} options={[{value:'left',label:'Esquerda'},{value:'center',label:'Centro'},{value:'right',label:'Direita'}]}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor</div><ColorPicker value={p.color} onChange={v=>onChange({color:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Button': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Rótulo e Estilo</div>
          <Txt label="Texto" value={p.label} onChange={v=>onChange({label:v})}/>
          <Num label="Fonte" value={p.fontSize} min={10} max={32} onChange={v=>onChange({fontSize:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={60} onChange={v=>onChange({borderRadius:v})}/>
          <Num label="Padding V." value={p.paddingVertical} min={4} max={40} onChange={v=>onChange({paddingVertical:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Ação ao clicar</div>
          <Sel label="Ao clicar" value={p.action} onChange={v=>onChange({action:v})} options={[{value:'none',label:'Nenhuma'},{value:'navigate',label:'Navegar para tela'},{value:'alert',label:'Mostrar alerta'}]}/>
          {p.action==='navigate'&&<Row label="Tela"><select className="prop-select" value={p.targetScreen} onChange={e=>onChange({targetScreen:e.target.value})}><option value="">Selecionar...</option>{screens.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></Row>}
          {p.action==='alert'&&<Txt label="Mensagem" value={p.alertMessage} onChange={v=>onChange({alertMessage:v})}/>}
        </div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Image': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Imagem</div>
          <Txt label="URL" value={p.source} placeholder="https://..." onChange={v=>onChange({source:v})}/>
          <Num label="Altura" value={p.height} min={50} max={700} onChange={v=>onChange({height:v})}/>
          <Sel label="Ajuste" value={p.resizeMode} onChange={v=>onChange({resizeMode:v})} options={['cover','contain','stretch']}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Fotos de exemplo</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
            {[['Paisagem','?random=1'],['Cidade','?random=2'],['Natureza','?random=3'],['Pessoas','?random=4']].map(([l,q])=>(
              <button key={l} className="btn btn-sm" onClick={()=>onChange({source:`https://picsum.photos/375/300${q}`})}>{l}</button>
            ))}
          </div>
        </div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Input': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Campo</div>
          <Txt label="Placeholder" value={p.placeholder} onChange={v=>onChange({placeholder:v})}/>
          <Txt label="Variável JS" value={p.variableName} placeholder="ex: email" onChange={v=>onChange({variableName:v})} mono/>
          <Num label="Fonte" value={p.fontSize} min={10} max={28} onChange={v=>onChange({fontSize:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={30} onChange={v=>onChange({borderRadius:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor da borda</div><ColorPicker value={p.borderColor} onChange={v=>onChange({borderColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'View': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Container</div>
          <Txt label="Label" value={p.label} onChange={v=>onChange({label:v})}/>
          <Num label="Altura" value={p.height} min={20} max={800} onChange={v=>onChange({height:v})}/>
          <Num label="Padding" value={p.padding} min={0} max={60} onChange={v=>onChange({padding:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={60} onChange={v=>onChange({borderRadius:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Card': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Conteúdo</div>
          <Txt label="Título" value={p.title} onChange={v=>onChange({title:v})}/>
          <Row label="Descrição"><textarea className="prop-input" value={p.description} rows={3} style={{resize:'vertical',fontSize:12}} onChange={e=>onChange({description:e.target.value})}/></Row>
        </div>
        <div className="prop-group"><div className="prop-group-title">Estilo</div>
          <Num label="Arredond." value={p.borderRadius} min={0} max={40} onChange={v=>onChange({borderRadius:v})}/>
          <Num label="Padding" value={p.padding} min={0} max={40} onChange={v=>onChange({padding:v})}/>
          <Num label="Sombra" value={p.shadowOpacity} min={0} max={1} step={.05} onChange={v=>onChange({shadowOpacity:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'SafeAreaView': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Header</div>
          <Txt label="Título" value={p.title} onChange={v=>onChange({title:v})}/>
          <Num label="Padding V." value={p.paddingVertical} min={8} max={60} onChange={v=>onChange({paddingVertical:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
      </>
    );
    case 'Divider': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Divisor</div>
          <Num label="Espessura" value={p.thickness} min={1} max={10} onChange={v=>onChange({thickness:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor</div><ColorPicker value={p.color} onChange={v=>onChange({color:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Switch': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Switch</div>
          <Txt label="Label" value={p.label} onChange={v=>onChange({label:v})}/>
          <Txt label="Variável" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor quando ativo</div><ColorPicker value={p.trackColor} onChange={v=>onChange({trackColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Slider': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Slider</div>
          <Txt label="Variável" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
          <Num label="Mínimo" value={p.minimumValue} onChange={v=>onChange({minimumValue:v})}/>
          <Num label="Máximo" value={p.maximumValue} onChange={v=>onChange({maximumValue:v})}/>
          <Num label="Valor" value={p.value} onChange={v=>onChange({value:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor do trilho</div><ColorPicker value={p.minimumTrackTintColor} onChange={v=>onChange({minimumTrackTintColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'FAB': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Botão Flutuante</div>
          <Num label="Tamanho" value={p.size} min={40} max={80} onChange={v=>onChange({size:v})}/>
          <Num label="Offset baixo" value={p.bottomOffset} min={0} max={100} onChange={v=>onChange({bottomOffset:v})}/>
          <Num label="Offset direita" value={p.rightOffset} min={0} max={100} onChange={v=>onChange({rightOffset:v})}/>
          <Sel label="Ação" value={p.action} onChange={v=>onChange({action:v})} options={[{value:'none',label:'Nenhuma'},{value:'navigate',label:'Navegar'},{value:'alert',label:'Alerta'}]}/>
          {p.action==='navigate'&&<Row label="Tela"><select className="prop-select" value={p.targetScreen} onChange={e=>onChange({targetScreen:e.target.value})}><option value="">Selecionar...</option>{screens.map(s=><option key={s.id} value={s.name}>{s.name}</option>)}</select></Row>}
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do ícone</div><ColorPicker value={p.iconColor} onChange={v=>onChange({iconColor:v})}/></div>
      </>
    );
    case 'Avatar': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Avatar</div>
          <Txt label="Nome" value={p.name} onChange={v=>onChange({name:v})}/>
          <Txt label="Foto URL" value={p.source} placeholder="https://..." onChange={v=>onChange({source:v})}/>
          <Num label="Tamanho" value={p.size} min={24} max={150} onChange={v=>onChange({size:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={999} onChange={v=>onChange({borderRadius:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto (iniciais)</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Badge': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Badge</div>
          <Txt label="Texto" value={p.text} onChange={v=>onChange({text:v})}/>
          <Num label="Fonte" value={p.fontSize} min={8} max={20} onChange={v=>onChange({fontSize:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'ProgressBar': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Progresso</div>
          <Txt label="Label" value={p.label} onChange={v=>onChange({label:v})}/>
          <Num label="Progresso" value={p.progress} min={0} max={1} step={.05} onChange={v=>onChange({progress:v})}/>
          <Num label="Altura" value={p.height} min={2} max={24} onChange={v=>onChange({height:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={20} onChange={v=>onChange({borderRadius:v})}/>
          <Row label="Mostrar %"><input type="checkbox" checked={p.showLabel} onChange={e=>onChange({showLabel:e.target.checked})}/></Row>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de preenchimento</div><ColorPicker value={p.color} onChange={v=>onChange({color:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do trilho</div><ColorPicker value={p.trackColor} onChange={v=>onChange({trackColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Rating': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Avaliação</div>
          <Num label="Estrelas" value={p.defaultRating} min={0} max={p.maxRating} step={.5} onChange={v=>onChange({defaultRating:v})}/>
          <Num label="Máximo" value={p.maxRating} min={3} max={10} onChange={v=>onChange({maxRating:v})}/>
          <Num label="Tamanho" value={p.size} min={16} max={64} onChange={v=>onChange({size:v})}/>
          <Txt label="Variável" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor ativa</div><ColorPicker value={p.activeColor} onChange={v=>onChange({activeColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor inativa</div><ColorPicker value={p.inactiveColor} onChange={v=>onChange({inactiveColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Chip': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Chip</div>
          <Txt label="Texto" value={p.label} onChange={v=>onChange({label:v})}/>
          <Num label="Fonte" value={p.fontSize} min={9} max={20} onChange={v=>onChange({fontSize:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={30} onChange={v=>onChange({borderRadius:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Checkbox': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Checkbox</div>
          <Txt label="Label" value={p.label} onChange={v=>onChange({label:v})}/>
          <Txt label="Variável" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
          <Num label="Fonte" value={p.fontSize} min={10} max={22} onChange={v=>onChange({fontSize:v})}/>
          <Row label="Marcado?"><input type="checkbox" checked={p.checked} onChange={e=>onChange({checked:e.target.checked})}/></Row>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor da marca</div><ColorPicker value={p.checkColor} onChange={v=>onChange({checkColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Icon': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Ícone</div>
          <Sel label="Biblioteca" value={p.library} onChange={v=>onChange({library:v})} options={['AntDesign','Feather','FontAwesome','Ionicons','MaterialIcons','Entypo']}/>
          <Num label="Tamanho" value={p.size} min={12} max={128} onChange={v=>onChange({size:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Selecionar ícone</div>
          <div className="icon-picker-grid">
            {ICON_OPTS.map(ic=>(
              <button key={ic.name} className={`icon-pick-btn${p.name===ic.name?' selected':''}`} onClick={()=>onChange({name:ic.name})}>
                <span style={{fontSize:18}}>{ic.e}</span><span className="ib-label">{ic.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor</div><ColorPicker value={p.color} onChange={v=>onChange({color:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Sound': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Player de Som</div>
          <Txt label="Título" value={p.title} onChange={v=>onChange({title:v})}/>
          <Txt label="Artista" value={p.artist} onChange={v=>onChange({artist:v})}/>
          <Txt label="URL do áudio" value={p.sourceUrl} placeholder="https://.../audio.mp3" onChange={v=>onChange({sourceUrl:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Video': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Player de Vídeo</div>
          <Txt label="URL do vídeo" value={p.sourceUrl} placeholder="https://.../video.mp4" onChange={v=>onChange({sourceUrl:v})}/>
          <Num label="Altura" value={p.height} min={120} max={600} onChange={v=>onChange({height:v})}/>
        </div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'Camera': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Câmera</div>
          <Sel label="Câmera" value={p.facing} onChange={v=>onChange({facing:v})} options={[{value:'back',label:'Traseira'},{value:'front',label:'Frontal'}]}/>
          <Num label="Altura" value={p.height} min={150} max={700} onChange={v=>onChange({height:v})}/>
          <Txt label="Variável foto" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
          <Row label="Botão captura"><input type="checkbox" checked={p.showCaptureButton} onChange={e=>onChange({showCaptureButton:e.target.checked})}/></Row>
        </div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'MapView': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Mapa</div>
          <Num label="Altura" value={p.height} min={150} max={700} onChange={v=>onChange({height:v})}/>
          <Txt label="Lat" value={String(p.latitude)} onChange={v=>onChange({latitude:parseFloat(v)||0})} mono/>
          <Txt label="Long" value={String(p.longitude)} onChange={v=>onChange({longitude:parseFloat(v)||0})} mono/>
          <Txt label="Marcador" value={p.markerTitle} onChange={v=>onChange({markerTitle:v})}/>
          <Row label="GPS do user"><input type="checkbox" checked={p.showsUserLocation} onChange={e=>onChange({showsUserLocation:e.target.checked})}/></Row>
        </div>
      </>
    );
    case 'QRScanner': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Scanner QR</div>
          <Num label="Altura" value={p.height} min={150} max={500} onChange={v=>onChange({height:v})}/>
          <Txt label="Variável" value={p.variableName} onChange={v=>onChange({variableName:v})} mono/>
          <Sel label="Ao escanear" value={p.onScanAction} onChange={v=>onChange({onScanAction:v})} options={[{value:'log',label:'Console log'},{value:'navigate',label:'Navegar'},{value:'alert',label:'Alerta'}]}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
      </>
    );
    case 'FaceCamera': return (
      <>
        <div className="prop-group"><div className="prop-group-title">Câmera + Face</div>
          <Num label="Altura" value={p.height} min={150} max={600} onChange={v=>onChange({height:v})}/>
          <Sel label="Câmera" value={p.facing} onChange={v=>onChange({facing:v})} options={[{value:'front',label:'Frontal'},{value:'back',label:'Traseira'}]}/>
          <Row label="Mostrar detecção"><input type="checkbox" checked={p.showDetection} onChange={e=>onChange({showDetection:e.target.checked})}/></Row>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor do frame</div><ColorPicker value={p.frameColor} onChange={v=>onChange({frameColor:v})}/></div>
      </>
    );
    // ── IA ──────────────────────────────────────────────────
    case 'ChatGPT': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Configuração</div>
          <Row label="Prompt"><textarea className="prop-input" value={p.systemPrompt} rows={3} style={{resize:'vertical',fontSize:11}} onChange={e=>onChange({systemPrompt:e.target.value})}/></Row>
          <Sel label="Modelo" value={p.model} onChange={v=>onChange({model:v})} options={['gpt-4o-mini','gpt-4o','gpt-3.5-turbo']}/>
          <Txt label="Placeholder" value={p.placeholder} onChange={v=>onChange({placeholder:v})}/>
          <Txt label="API Key" value={p.apiKey} placeholder="sk-..." onChange={v=>onChange({apiKey:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
      </>
    );
    case 'GeminiAI': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Configuração</div>
          <Row label="Prompt"><textarea className="prop-input" value={p.systemPrompt} rows={3} style={{resize:'vertical',fontSize:11}} onChange={e=>onChange({systemPrompt:e.target.value})}/></Row>
          <Sel label="Modelo" value={p.model} onChange={v=>onChange({model:v})} options={['gemini-1.5-flash','gemini-1.5-pro','gemini-pro']}/>
          <Txt label="Placeholder" value={p.placeholder} onChange={v=>onChange({placeholder:v})}/>
          <Txt label="API Key" value={p.apiKey} placeholder="AIza..." onChange={v=>onChange({apiKey:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
      </>
    );
    case 'TranslateWidget': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Tradução</div>
          <Sel label="De" value={p.sourceLang} onChange={v=>onChange({sourceLang:v})} options={[{value:'pt',label:'Português'},{value:'en',label:'Inglês'},{value:'es',label:'Espanhol'},{value:'fr',label:'Francês'},{value:'de',label:'Alemão'}]}/>
          <Sel label="Para" value={p.targetLang} onChange={v=>onChange({targetLang:v})} options={[{value:'en',label:'Inglês'},{value:'pt',label:'Português'},{value:'es',label:'Espanhol'},{value:'fr',label:'Francês'},{value:'ja',label:'Japonês'}]}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    // ── API COMPONENTS ────────────────────────────────────────
    case 'WeatherWidget': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Localização</div>
          <Txt label="Cidade" value={p.city} onChange={v=>onChange({city:v})}/>
          <Txt label="Latitude" value={String(p.latitude)} onChange={v=>onChange({latitude:parseFloat(v)||0})} mono/>
          <Txt label="Longitude" value={String(p.longitude)} onChange={v=>onChange({longitude:parseFloat(v)||0})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'CryptoPrice': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Criptomoeda</div>
          <Sel label="Moeda" value={p.coinId} onChange={v=>onChange({coinId:v, coinName:({bitcoin:'Bitcoin',ethereum:'Ethereum',solana:'Solana','binancecoin':'BNB',cardano:'Cardano'})[v]||v})} options={['bitcoin','ethereum','solana','binancecoin','cardano']}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'PokeCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Pokémon</div>
          <Num label="ID (1-1010)" value={p.pokemonId} min={1} max={1010} onChange={v=>onChange({pokemonId:v})}/>
          <Txt label="Nome (URL)" value={p.pokemonName} placeholder="ex: pikachu" onChange={v=>onChange({pokemonName:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'CountryCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">País</div>
          <Txt label="Nome (inglês)" value={p.country} placeholder="Brazil" onChange={v=>onChange({country:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'JokeCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Piada</div>
          <Sel label="Categoria" value={p.category} onChange={v=>onChange({category:v})} options={['Any','Programming','Misc','Dark','Pun','Spooky','Christmas']}/>
          <Txt label="Botão" value={p.buttonLabel} onChange={v=>onChange({buttonLabel:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'RandomUser': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Usuário</div>
          <Sel label="Gênero" value={p.gender} onChange={v=>onChange({gender:v})} options={['any','male','female']}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'GitHubCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">GitHub</div>
          <Txt label="Usuário" value={p.username} placeholder="torvalds" onChange={v=>onChange({username:v})} mono/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'QRGenerator': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">QR Code</div>
          <Txt label="Conteúdo" value={p.text} placeholder="https://..." onChange={v=>onChange({text:v})}/>
          <Num label="Tamanho" value={p.size} min={80} max={300} onChange={v=>onChange({size:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor do QR</div><ColorPicker value={p.foregroundColor} onChange={v=>onChange({foregroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'IpGeo': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'NewsFeed': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Configurações</div>
          <Txt label="Busca" value={p.query} onChange={v=>onChange({query:v})}/>
          <Txt label="Chave API" value={p.apiKey} placeholder="SUA_API_KEY" onChange={v=>onChange({apiKey:v})} mono/>
          <Num label="Qtd. itens" value={p.pageSize} min={1} max={10} onChange={v=>onChange({pageSize:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'MovieCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Filme</div>
          <Txt label="ID do filme" value={p.movieId} placeholder="299536" onChange={v=>onChange({movieId:v})} mono/>
          <Txt label="Chave API" value={p.apiKey} placeholder="SUA_API_KEY" onChange={v=>onChange({apiKey:v})} mono/>
          <Num label="Altura" value={p.height} min={100} max={400} onChange={v=>onChange({height:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    // ── NOVAS APIS ────────────────────────────────────────────
    case 'QuoteCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor do texto</div><ColorPicker value={p.textColor} onChange={v=>onChange({textColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'MealCard': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Receita</div>
          <Txt label="Nome" value={p.mealName} placeholder="Spaghetti" onChange={v=>onChange({mealName:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'DogWidget': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Dog Widget</div>
          <Num label="Altura" value={p.height} min={80} max={400} onChange={v=>onChange({height:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'NumberFact': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Número</div>
          <Num label="Número" value={p.number} min={0} max={99999} onChange={v=>onChange({number:v})}/>
          <Sel label="Tipo" value={p.factType} onChange={v=>onChange({factType:v})} options={[{value:'trivia',label:'Curiosidade'},{value:'math',label:'Matemática'},{value:'date',label:'Data'},{value:'year',label:'Ano'}]}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <div className="prop-group"><div className="prop-group-title">Cor de destaque</div><ColorPicker value={p.accentColor} onChange={v=>onChange({accentColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'AvatarGen': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Avatar</div>
          <Txt label="Seed" value={p.seed} placeholder="felix" onChange={v=>onChange({seed:v})} mono/>
          <Sel label="Estilo" value={p.style} onChange={v=>onChange({style:v})} options={['avataaars','bottts','identicon','micah','pixel-art','lorelei','fun-emoji']}/>
          <Num label="Tamanho" value={p.size} min={40} max={200} onChange={v=>onChange({size:v})}/>
          <Num label="Arredond." value={p.borderRadius} min={0} max={999} onChange={v=>onChange({borderRadius:v})}/>
        </div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    case 'CatWidget': return (
      <>
        {def && <ApiInfoBox def={def}/>}
        <div className="prop-group"><div className="prop-group-title">Cat Widget</div>
          <Num label="Altura" value={p.height} min={80} max={400} onChange={v=>onChange({height:v})}/>
        </div>
        <div className="prop-group"><div className="prop-group-title">Cor de fundo</div><ColorPicker value={p.backgroundColor} onChange={v=>onChange({backgroundColor:v})}/></div>
        <Margins p={p} onChange={onChange}/>
      </>
    );
    default: return <div className="prop-empty"><div>Sem propriedades</div></div>;
  }
}

export default function PropertiesPanel() {
  const { project, getCurrentScreen, updateElement, addScreen, deleteScreen, switchScreen, renameScreen, creationMode, saveCustomComponent, customComponents, deleteCustomComponent, addCustomElement } = useApp();
  const [activeTab, setActiveTab] = useState('props');
  const screen = getCurrentScreen();
  const selectedEl = screen?.elements.find(e => e.id === project.selectedElementId);
  const def = selectedEl ? COMPONENT_DEFS[selectedEl.type] : null;
  const isAdvanced = creationMode === 'advanced';

  const handleUpdateEl = (props) => {
    if (!selectedEl) return;
    updateElement(selectedEl.id, { props: { ...selectedEl.props, ...(props.props || props) } });
  };

  const handleUpdateAdvanced = (changes) => {
    if (!selectedEl) return;
    updateElement(selectedEl.id, changes);
  };

  const handleSaveCustom = () => {
    if (!selectedEl) return;
    const name = window.prompt('Nome para este componente reutilizável:');
    if (name && name.trim()) {
      saveCustomComponent(selectedEl, name.trim());
    }
  };

  return (
    <aside className="right-panel">
      <div className="panel-tabs">
        <button className={`panel-tab${activeTab==='props'?' active':''}`} onClick={()=>setActiveTab('props')}><Settings2 size={13}/> Config</button>
        <button className={`panel-tab${activeTab==='screens'?' active':''}`} onClick={()=>setActiveTab('screens')}><Layers size={13}/> Módulos</button>
        <button className={`panel-tab${activeTab==='custom'?' active':''}`} onClick={()=>setActiveTab('custom')}><Bookmark size={13}/> Salvos</button>
      </div>
      <div className="panel-scroll">
        {activeTab==='props' ? (
          selectedEl ? (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, padding:'10px 12px', background:'var(--glass-light)', borderRadius:'var(--r-md)', border:'1px solid var(--border)' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'linear-gradient(135deg,var(--accent),var(--accent2))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>
                  <Smartphone size={16}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{def?.label||selectedEl.type}</div>
                  <div style={{ fontSize:9, color:'var(--text-3)', fontFamily:'var(--mono)' }}>{selectedEl.id}</div>
                </div>
                {(def?.category==='api' || def?.category==='ia') && (
                  <div style={{ marginLeft:'auto', fontSize:9, background:'rgba(52,211,153,.15)', color:'var(--success)', border:'1px solid rgba(52,211,153,.3)', padding:'2px 8px', borderRadius:5, fontWeight:800 }}>API</div>
                )}
              </div>

              {/* Save as component button */}
              <button className="btn save-comp-btn" onClick={handleSaveCustom}>
                <Save size={11}/> Salvar como Componente
              </button>

              {/* Advanced mode position controls */}
              {isAdvanced && selectedEl.advancedProps && (
                <AdvancedPositionGroup el={selectedEl} updateEl={handleUpdateAdvanced}/>
              )}

              <ElProps el={selectedEl} onChange={props => updateElement(selectedEl.id, { props:{ ...selectedEl.props, ...props } })} screens={project.screens}/>
            </>
          ) : (
            <div className="prop-empty">
              <div className="prop-empty-icon"><Settings2 size={36} strokeWidth={1}/></div>
              <div style={{ fontWeight:600, marginBottom:4 }}>Nenhum componente selecionado</div>
              <div style={{ fontSize:12, lineHeight:1.5 }}>Clique em qualquer componente na linha de montagem para editar</div>
            </div>
          )
        ) : activeTab==='screens' ? (
          <>
            <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center', marginBottom:10 }} onClick={addScreen}><Plus size={14}/> Nova Tela</button>
            <div className="screen-list">
              {project.screens.map(s => (
                <div key={s.id} className={`screen-item${s.id===project.currentScreenId?' active':''}`} onClick={()=>switchScreen(s.id)}>
                  <div className="screen-item-icon"><Smartphone size={15}/></div>
                  <input className="screen-item-name" value={s.name} onChange={e=>renameScreen(s.id,e.target.value)} onClick={e=>e.stopPropagation()}/>
                  <span className="screen-item-count">{s.elements.length}</span>
                  <button className="screen-item-del" onClick={e=>{e.stopPropagation();deleteScreen(s.id);}}><X size={13}/></button>
                </div>
              ))}
            </div>
            <div className="stats-panel">
              <div className="stats-panel-title">Estatísticas</div>
              <div className="stats-grid">
                <div className="stat-item"><div className="stat-value">{project.screens.length}</div><div className="stat-label">Telas</div></div>
                <div className="stat-item"><div className="stat-value">{project.screens.reduce((a,s)=>a+(s.elements?.length||0),0)}</div><div className="stat-label">Componentes</div></div>
                <div className="stat-item"><div className="stat-value">{project.screens.reduce((a,s)=>a+(s.blocks?.length||0),0)}</div><div className="stat-label">Blocos</div></div>
              </div>
            </div>
          </>
        ) : (
          /* Componentes Salvos Tab */
          customComponents.length === 0 ? (
            <div className="prop-empty">
              <div className="prop-empty-icon"><Bookmark size={36} strokeWidth={1}/></div>
              <div style={{ fontWeight:600, marginBottom:4 }}>Nenhum componente salvo</div>
              <div style={{ fontSize:12, lineHeight:1.5 }}>Selecione um componente na tela e clique em "Salvar como Componente"</div>
            </div>
          ) : (
            <>
              <div style={{ fontSize:10, color:'var(--text-3)', marginBottom:10 }}>{customComponents.length} componente{customComponents.length!==1?'s':''} salvo{customComponents.length!==1?'s':''}</div>
              <div className="custom-comp-list">
                {customComponents.map(cc => (
                  <div key={cc.id} className="custom-comp-card" onClick={() => addCustomElement(cc)}>
                    <div className="custom-comp-card-icon"><Package size={14}/></div>
                    <div className="custom-comp-card-info">
                      <div className="custom-comp-card-name">{cc.name}</div>
                      <div className="custom-comp-card-type">{COMPONENT_DEFS[cc.type]?.label || cc.type}</div>
                    </div>
                    <button className="custom-comp-card-del" onClick={e=>{e.stopPropagation();deleteCustomComponent(cc.id);}}><X size={12}/></button>
                  </div>
                ))}
              </div>
            </>
          )
        )}
      </div>
    </aside>
  );
}
