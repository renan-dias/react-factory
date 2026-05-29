import React, { useState } from 'react';
import { Settings2, Layers, Plus, X, Smartphone } from 'lucide-react';
import { useApp, COMPONENT_DEFS } from '../contexts/AppContext';

const PALETTE = ['#0f172a','#1e293b','#334155','#475569','#64748b','#94a3b8','#ffffff','#f1f5f9','#e2e8f0','#fef3c7','#fde68a','#f59e0b','#d97706','#92400e','#fecdd3','#fca5a5','#ef4444','#dc2626','#c0e6d6','#6ee7b7','#10b981','#059669','#bfdbfe','#93c5fd','#3b82f6','#2563eb','#ddd6fe','#c4b5fd','#8b5cf6','#7c3aed','#6366f1','#4f46e5'];

function ColorPicker({ value, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
        <input type="color" className="prop-input-color" value={value || '#000000'} onChange={e => onChange(e.target.value)} />
        <input className="prop-input" type="text" value={value || ''} onChange={e => onChange(e.target.value)} style={{ flex: 1, fontFamily: 'var(--ff-mono)', fontSize: 11 }} placeholder="#000000" />
      </div>
      <div className="color-swatches">
        {PALETTE.map(c => (
          <div
            key={c}
            className={`color-swatch${value === c ? ' selected' : ''}`}
            style={{ background: c, boxShadow: c === '#ffffff' ? 'inset 0 0 0 1px #e2e8f0' : 'none' }}
            onClick={() => onChange(c)}
            title={c}
          />
        ))}
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="prop-row">
      <span className="prop-label">{label}</span>
      {children}
    </div>
  );
}

function NumInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <Row label={label}>
      <input className="prop-input" type="number" value={value} min={min} max={max} step={step}
        onChange={e => onChange(Number(e.target.value))} />
    </Row>
  );
}

function SelInput({ label, value, options, onChange }) {
  return (
    <Row label={label}>
      <select className="prop-select" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
    </Row>
  );
}

function MarginsGroup({ p, onChange }) {
  return (
    <div className="prop-group">
      <div className="prop-group-title">Espaçamento</div>
      <div className="margins-grid">
        {[['marginTop','Cima'],['marginBottom','Baixo'],['marginLeft','Esquerda'],['marginRight','Direita']].map(([k, l]) => (
          <div key={k} className="margin-field">
            <label>{l}</label>
            <input className="prop-input" type="number" value={p[k] ?? 0} style={{ width: '100%' }} onChange={e => onChange({ [k]: Number(e.target.value) })} />
          </div>
        ))}
      </div>
    </div>
  );
}

const ICON_OPTIONS = [
  { name: 'star', label: '★ star' }, { name: 'heart', label: '♥ heart' }, { name: 'home', label: '⌂ home' },
  { name: 'user', label: '◉ user' }, { name: 'search', label: '⊛ search' }, { name: 'settings', label: '⚙ settings' },
  { name: 'bell', label: '♪ bell' }, { name: 'camera', label: '⊡ camera' }, { name: 'phone', label: '☎ phone' },
  { name: 'mail', label: '✉ mail' }, { name: 'check', label: '✓ check' }, { name: 'close', label: '✕ close' },
  { name: 'plus', label: '+ plus' }, { name: 'minus', label: '− minus' }, { name: 'arrow', label: '→ arrow' },
  { name: 'share', label: '↑ share' }, { name: 'bookmark', label: '◈ bookmark' }, { name: 'edit', label: '✎ edit' },
  { name: 'trash', label: '⊗ trash' }, { name: 'info', label: 'ℹ info' }, { name: 'lock', label: '⊝ lock' },
  { name: 'map', label: '⊞ map' }, { name: 'location', label: '⊙ location' }, { name: 'calendar', label: '▦ calendar' },
  { name: 'clock', label: '◷ clock' }, { name: 'flag', label: '⚑ flag' }, { name: 'chart', label: '▨ chart' },
  { name: 'music', label: '♫ music' }, { name: 'wifi', label: '▴ wifi' }, { name: 'battery', label: '▰ battery' },
];

function ElProps({ el, onChange, screens }) {
  const p = el.props;

  switch (el.type) {
    case 'Text':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Conteúdo</div>
            <Row label="Texto"><textarea className="prop-input" value={p.text} rows={3} style={{ resize: 'vertical', fontSize: 12 }} onChange={e => onChange({ text: e.target.value })} /></Row>
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Tipografia</div>
            <NumInput label="Tamanho" value={p.fontSize} min={8} max={72} onChange={v => onChange({ fontSize: v })} />
            <SelInput label="Peso" value={p.fontWeight} onChange={v => onChange({ fontWeight: v })} options={[{value:'normal',label:'Normal'},{value:'bold',label:'Negrito'},{value:'600',label:'Semi-bold'},{value:'300',label:'Leve'}]} />
            <SelInput label="Alinhamento" value={p.textAlign} onChange={v => onChange({ textAlign: v })} options={[{value:'left',label:'Esquerda'},{value:'center',label:'Centro'},{value:'right',label:'Direita'}]} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor do texto</div>
            <ColorPicker value={p.color} onChange={v => onChange({ color: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Button':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Rótulo e Estilo</div>
            <Row label="Texto"><input className="prop-input" value={p.label} onChange={e => onChange({ label: e.target.value })} /></Row>
            <NumInput label="Fonte" value={p.fontSize} min={10} max={32} onChange={v => onChange({ fontSize: v })} />
            <NumInput label="Arredond." value={p.borderRadius} min={0} max={60} onChange={v => onChange({ borderRadius: v })} />
            <NumInput label="Padding V." value={p.paddingVertical} min={4} max={40} onChange={v => onChange({ paddingVertical: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor de fundo</div>
            <ColorPicker value={p.backgroundColor} onChange={v => onChange({ backgroundColor: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor do texto</div>
            <ColorPicker value={p.textColor} onChange={v => onChange({ textColor: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Ação ao clicar</div>
            <SelInput label="Ao clicar" value={p.action} onChange={v => onChange({ action: v })} options={[{value:'none',label:'Nenhuma'},{value:'navigate',label:'Navegar para tela'},{value:'alert',label:'Mostrar alerta'}]} />
            {p.action === 'navigate' && (
              <Row label="Tela destino">
                <select className="prop-select" value={p.targetScreen} onChange={e => onChange({ targetScreen: e.target.value })}>
                  <option value="">Selecionar tela...</option>
                  {screens.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </Row>
            )}
            {p.action === 'alert' && (
              <Row label="Mensagem"><input className="prop-input" value={p.alertMessage} onChange={e => onChange({ alertMessage: e.target.value })} /></Row>
            )}
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Image':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Imagem</div>
            <Row label="URL"><input className="prop-input" value={p.source} placeholder="https://..." onChange={e => onChange({ source: e.target.value })} /></Row>
            <NumInput label="Altura" value={p.height} min={50} max={700} onChange={v => onChange({ height: v })} />
            <SelInput label="Ajuste" value={p.resizeMode} onChange={v => onChange({ resizeMode: v })} options={['cover','contain','stretch']} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Fotos de exemplo</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {[['Paisagem','?random=1'],['Cidade','?random=2'],['Natureza','?random=3'],['Pessoas','?random=4']].map(([l,q]) => (
                <button key={l} className="btn btn-sm" onClick={() => onChange({ source: `https://picsum.photos/375/300${q}` })}>{l}</button>
              ))}
            </div>
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Input':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Campo de texto</div>
            <Row label="Placeholder"><input className="prop-input" value={p.placeholder} onChange={e => onChange({ placeholder: e.target.value })} /></Row>
            <Row label="Variável JS"><input className="prop-input" value={p.variableName} placeholder="ex: email" onChange={e => onChange({ variableName: e.target.value })} style={{ fontFamily: 'var(--ff-mono)', fontSize: 11 }} /></Row>
            <NumInput label="Fonte" value={p.fontSize} min={10} max={28} onChange={v => onChange({ fontSize: v })} />
            <NumInput label="Arredond." value={p.borderRadius} min={0} max={30} onChange={v => onChange({ borderRadius: v })} />
            <NumInput label="Padding H." value={p.paddingHorizontal} min={4} max={40} onChange={v => onChange({ paddingHorizontal: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor da borda</div>
            <ColorPicker value={p.borderColor} onChange={v => onChange({ borderColor: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor de fundo</div>
            <ColorPicker value={p.backgroundColor} onChange={v => onChange({ backgroundColor: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'View':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Container</div>
            <Row label="Label"><input className="prop-input" value={p.label} onChange={e => onChange({ label: e.target.value })} /></Row>
            <NumInput label="Altura" value={p.height} min={20} max={800} onChange={v => onChange({ height: v })} />
            <NumInput label="Padding" value={p.padding} min={0} max={60} onChange={v => onChange({ padding: v })} />
            <NumInput label="Arredond." value={p.borderRadius} min={0} max={60} onChange={v => onChange({ borderRadius: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor de fundo</div>
            <ColorPicker value={p.backgroundColor} onChange={v => onChange({ backgroundColor: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Card':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Conteúdo</div>
            <Row label="Título"><input className="prop-input" value={p.title} onChange={e => onChange({ title: e.target.value })} /></Row>
            <Row label="Descrição"><textarea className="prop-input" value={p.description} rows={3} style={{ resize: 'vertical', fontSize: 12 }} onChange={e => onChange({ description: e.target.value })} /></Row>
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Estilo</div>
            <NumInput label="Arredond." value={p.borderRadius} min={0} max={40} onChange={v => onChange({ borderRadius: v })} />
            <NumInput label="Padding" value={p.padding} min={0} max={40} onChange={v => onChange({ padding: v })} />
            <NumInput label="Sombra" value={p.shadowOpacity} min={0} max={1} step={0.05} onChange={v => onChange({ shadowOpacity: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor de fundo</div>
            <ColorPicker value={p.backgroundColor} onChange={v => onChange({ backgroundColor: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Switch':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Switch</div>
            <Row label="Label"><input className="prop-input" value={p.label} onChange={e => onChange({ label: e.target.value })} /></Row>
            <Row label="Variável JS"><input className="prop-input" value={p.variableName} placeholder="ex: darkMode" onChange={e => onChange({ variableName: e.target.value })} style={{ fontFamily: 'var(--ff-mono)', fontSize: 11 }} /></Row>
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor quando ativo</div>
            <ColorPicker value={p.trackColor} onChange={v => onChange({ trackColor: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Slider':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Slider</div>
            <Row label="Variável JS"><input className="prop-input" value={p.variableName} onChange={e => onChange({ variableName: e.target.value })} style={{ fontFamily: 'var(--ff-mono)', fontSize: 11 }} /></Row>
            <NumInput label="Mínimo" value={p.minimumValue} onChange={v => onChange({ minimumValue: v })} />
            <NumInput label="Máximo" value={p.maximumValue} onChange={v => onChange({ maximumValue: v })} />
            <NumInput label="Valor inicial" value={p.value} onChange={v => onChange({ value: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor do trilho</div>
            <ColorPicker value={p.minimumTrackTintColor} onChange={v => onChange({ minimumTrackTintColor: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Icon':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Ícone</div>
            <SelInput label="Biblioteca" value={p.library} onChange={v => onChange({ library: v })} options={['AntDesign','Feather','FontAwesome','Ionicons','MaterialIcons','Entypo']} />
            <NumInput label="Tamanho" value={p.size} min={12} max={128} onChange={v => onChange({ size: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Selecionar ícone</div>
            <div className="icon-picker-grid">
              {ICON_OPTIONS.map(ic => (
                <button key={ic.name} className={`icon-pick-btn${p.name === ic.name ? ' selected' : ''}`} onClick={() => onChange({ name: ic.name })}>
                  <span style={{ fontSize: 18 }}>{ic.label.split(' ')[0]}</span>
                  <span className="ib-label">{ic.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor</div>
            <ColorPicker value={p.color} onChange={v => onChange({ color: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'Divider':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Divisor</div>
            <NumInput label="Espessura" value={p.thickness} min={1} max={10} onChange={v => onChange({ thickness: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor</div>
            <ColorPicker value={p.color} onChange={v => onChange({ color: v })} />
          </div>
          <MarginsGroup p={p} onChange={onChange} />
        </>
      );

    case 'SafeAreaView':
      return (
        <>
          <div className="prop-group">
            <div className="prop-group-title">Header / SafeArea</div>
            <Row label="Título"><input className="prop-input" value={p.title} onChange={e => onChange({ title: e.target.value })} /></Row>
            <NumInput label="Padding V." value={p.paddingVertical} min={8} max={60} onChange={v => onChange({ paddingVertical: v })} />
          </div>
          <div className="prop-group">
            <div className="prop-group-title">Cor de fundo</div>
            <ColorPicker value={p.backgroundColor} onChange={v => onChange({ backgroundColor: v })} />
          </div>
        </>
      );

    default:
      return <div className="prop-empty"><div>Sem propriedades disponíveis</div></div>;
  }
}

export default function PropertiesPanel() {
  const { project, getCurrentScreen, updateElement, addScreen, deleteScreen, switchScreen, renameScreen } = useApp();
  const [activeTab, setActiveTab] = useState('props');
  const screen = getCurrentScreen();
  const selectedEl = screen?.elements.find(e => e.id === project.selectedElementId);

  const handleChange = (props) => { if (selectedEl) updateElement(selectedEl.id, props); };

  return (
    <aside className="right-panel">
      <div className="panel-tabs">
        <button className={`panel-tab${activeTab === 'props' ? ' active' : ''}`} onClick={() => setActiveTab('props')}>
          <Settings2 size={13} /> Config
        </button>
        <button className={`panel-tab${activeTab === 'screens' ? ' active' : ''}`} onClick={() => setActiveTab('screens')}>
          <Layers size={13} /> Módulos
        </button>
      </div>

      <div className="panel-scroll">
        {activeTab === 'props' ? (
          <>
            {selectedEl ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '10px 12px', background: 'var(--glass-bg-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), var(--accent2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{COMPONENT_DEFS[selectedEl.type]?.label}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--ff-mono)' }}>{selectedEl.id}</div>
                  </div>
                </div>
                <ElProps el={selectedEl} onChange={handleChange} screens={project.screens} />
              </>
            ) : (
              <div className="prop-empty">
                <div className="prop-empty-icon"><Settings2 size={36} strokeWidth={1} /></div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Nenhum componente selecionado</div>
                <div style={{ fontSize: 12, lineHeight: 1.5 }}>Clique em um componente na linha de montagem para editar suas propriedades</div>
              </div>
            )}
          </>
        ) : (
          <>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 10 }} onClick={addScreen}>
              <Plus size={14} /> Nova Tela
            </button>
            <div className="screen-list">
              {project.screens.map(s => (
                <div key={s.id} className={`screen-item${s.id === project.currentScreenId ? ' active' : ''}`} onClick={() => switchScreen(s.id)}>
                  <div className="screen-item-icon"><Smartphone size={15} /></div>
                  <input className="screen-item-name" value={s.name} onChange={e => renameScreen(s.id, e.target.value)} onClick={e => e.stopPropagation()} />
                  <span className="screen-item-count">{s.elements.length}</span>
                  <button className="screen-item-del" onClick={e => { e.stopPropagation(); deleteScreen(s.id); }} title="Remover tela">
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
            <div className="stats-panel">
              <div className="stats-panel-title">Estatísticas do Projeto</div>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{project.screens.length}</div>
                  <div className="stat-label">Telas</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{project.screens.reduce((a, s) => a + s.elements.length, 0)}</div>
                  <div className="stat-label">Componentes</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{project.screens.reduce((a, s) => a + (s.blocks?.length || 0), 0)}</div>
                  <div className="stat-label">Blocos</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
