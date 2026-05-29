import React, { useState } from 'react';
import { Puzzle, Plus, X, Zap, ArrowRight, GitBranch, ChevronDown } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const EVENT_TYPES = [
  { value:'onPress',      label:'Ao pressionar',    icon:'👆', hasElement:true },
  { value:'onLongPress',  label:'Ao segurar',        icon:'✋', hasElement:true },
  { value:'onMount',      label:'Ao abrir tela',     icon:'🚀', hasElement:false },
  { value:'onUnmount',    label:'Ao sair da tela',   icon:'🚪', hasElement:false },
  { value:'onChange',     label:'Ao digitar em',     icon:'⌨️', hasElement:true },
  { value:'onSwipe',      label:'Ao deslizar',       icon:'👈', hasElement:false },
  { value:'onFocus',      label:'Ao focar em',       icon:'🎯', hasElement:true },
];

const ACTION_TYPES = [
  // Navegação
  { value:'navigate',       label:'Navegar para tela',    icon:'→',  group:'Navegação',    params:['screen'] },
  { value:'goBack',         label:'Voltar tela anterior', icon:'←',  group:'Navegação',    params:[] },
  { value:'openURL',        label:'Abrir URL',            icon:'🌐', group:'Navegação',    params:['url'] },
  // Interface
  { value:'alert',          label:'Mostrar alerta',       icon:'⚠️', group:'Interface',    params:['message'] },
  { value:'toast',          label:'Mostrar toast',        icon:'💬', group:'Interface',    params:['message'] },
  { value:'vibrate',        label:'Vibrar dispositivo',   icon:'📳', group:'Interface',    params:[] },
  { value:'scrollTop',      label:'Rolar ao topo',        icon:'⬆️', group:'Interface',    params:[] },
  // Dados
  { value:'setState',       label:'Definir variável',     icon:'📝', group:'Dados',        params:['variable','value'] },
  { value:'clearVar',       label:'Limpar variável',      icon:'🗑️', group:'Dados',        params:['variable'] },
  { value:'saveStorage',    label:'Salvar no Storage',    icon:'💾', group:'Dados',        params:['key','value'] },
  { value:'loadStorage',    label:'Carregar do Storage',  icon:'📂', group:'Dados',        params:['key','variable'] },
  { value:'fetchAPI',       label:'Chamar API (fetch)',   icon:'🔗', group:'Dados',        params:['url','variable'] },
  // Mídia
  { value:'playSound',      label:'Tocar áudio',          icon:'🔊', group:'Mídia',        params:['url'] },
  { value:'stopSound',      label:'Parar áudio',          icon:'⏹️', group:'Mídia',        params:[] },
  { value:'shareContent',   label:'Compartilhar conteúdo',icon:'📤', group:'Mídia',        params:['message'] },
  { value:'copyClipboard',  label:'Copiar para clipboard',icon:'📋', group:'Mídia',        params:['text'] },
  // Controle
  { value:'log',            label:'Console.log',          icon:'🖥️', group:'Debug',        params:['message'] },
  { value:'timer',          label:'Timer (ms)',            icon:'⏱️', group:'Controle',     params:['delay'] },
];

const CONDITION_TYPES = [
  { value:'if_equals',   label:'Se variável =', icon:'=', params:['variable','value'] },
  { value:'if_greater',  label:'Se variável >', icon:'>', params:['variable','value'] },
  { value:'if_truthy',   label:'Se variável é verdadeira', icon:'✓', params:['variable'] },
  { value:'if_empty',    label:'Se variável está vazia',   icon:'∅', params:['variable'] },
];

const GROUP_COLORS = { 'Navegação':'#6366f1','Interface':'#0ea5e9','Dados':'#10b981','Mídia':'#f59e0b','Debug':'#64748b','Controle':'#8b5cf6' };

function GroupedSelect({ value, onChange, placeholder }) {
  const groups = ACTION_TYPES.reduce((acc, a) => {
    if (!acc[a.group]) acc[a.group] = [];
    acc[a.group].push(a);
    return acc;
  }, {});

  const selected = ACTION_TYPES.find(a => a.value === value);

  return (
    <div style={{ position:'relative', flex:1 }}>
      <select
        className="block-chip-select"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width:'100%', paddingRight:20 }}
      >
        <option value="">{placeholder||'Selecionar ação...'}</option>
        {Object.entries(groups).map(([group, actions]) => (
          <optgroup key={group} label={`── ${group}`}>
            {actions.map(a => (
              <option key={a.value} value={a.value}>{a.icon} {a.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function ActionParams({ action, onChange, screens }) {
  const def = ACTION_TYPES.find(a => a.value === action.type);
  if (!def || !def.params.length) return null;

  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginTop:4, marginLeft:16 }}>
      {def.params.map(param => (
        param === 'screen' ? (
          <select key={param} className="block-chip-select" value={action[param]||''} onChange={e => onChange({...action, [param]:e.target.value})}>
            <option value="">Tela...</option>
            {screens.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        ) : (
          <input
            key={param}
            className="block-chip-input"
            placeholder={param === 'url' ? 'https://...' : param === 'delay' ? '1000' : `${param}...`}
            value={action[param]||''}
            onChange={e => onChange({...action, [param]:e.target.value})}
            style={{ maxWidth: param==='url'?160:90 }}
          />
        )
      ))}
    </div>
  );
}

function ConditionBlock({ condition, onChange }) {
  const def = CONDITION_TYPES.find(c => c.value === condition.type) || CONDITION_TYPES[0];
  return (
    <div className="block-chip block-control">
      <GitBranch size={11}/>
      <select className="block-chip-select" value={condition.type||'if_equals'} onChange={e => onChange({...condition, type:e.target.value})}>
        {CONDITION_TYPES.map(c => <option key={c.value} value={c.value}>{c.icon} {c.label}</option>)}
      </select>
      <input className="block-chip-input" placeholder="variável" value={condition.variable||''} onChange={e => onChange({...condition, variable:e.target.value})} style={{ maxWidth:70 }}/>
      {def.params.includes('value') && (
        <>
          <span style={{ color:'rgba(255,255,255,.6)', fontSize:12 }}>=</span>
          <input className="block-chip-input" placeholder="valor" value={condition.value||''} onChange={e => onChange({...condition, value:e.target.value})} style={{ maxWidth:70 }}/>
        </>
      )}
    </div>
  );
}

function BlockSequence({ block, onDelete, onUpdate, elements, screens }) {
  const [showCondition, setShowCondition] = useState(!!block.condition);
  const eventDef = EVENT_TYPES.find(e => e.value === block.event) || EVENT_TYPES[0];

  const addAction = () => onUpdate({ actions:[...(block.actions||[]), { type:'navigate', screen:'', message:'', variable:'', value:'', url:'', key:'', text:'', delay:'', url2:'' }] });
  const updateAction = (idx, changes) => { const a=[...(block.actions||[])]; a[idx]={...a[idx],...changes}; onUpdate({actions:a}); };
  const removeAction = (idx) => onUpdate({ actions:(block.actions||[]).filter((_,i)=>i!==idx) });
  const toggleCondition = () => {
    setShowCondition(v => !v);
    if (!block.condition) onUpdate({ condition:{ type:'if_equals', variable:'', value:'' } });
  };

  return (
    <div className="block-sequence">
      <button className="block-seq-del" onClick={onDelete} title="Remover bloco"><X size={13}/></button>

      {/* Event */}
      <div className="block-chip block-event">
        <Zap size={12}/>
        <select className="block-chip-select" value={block.event} onChange={e => onUpdate({event:e.target.value})}>
          {EVENT_TYPES.map(et => <option key={et.value} value={et.value}>{et.icon} {et.label}</option>)}
        </select>
        {eventDef.hasElement && (
          <select className="block-chip-select" value={block.elementId||''} onChange={e => onUpdate({elementId:e.target.value})}>
            <option value="">Elemento...</option>
            {elements.map(el => <option key={el.id} value={el.id}>{el.props.label||el.props.text||el.type}</option>)}
          </select>
        )}
      </div>

      {/* Optional Condition */}
      {showCondition && block.condition && (
        <ConditionBlock
          condition={block.condition}
          onChange={cond => onUpdate({condition:cond})}
        />
      )}

      {/* Actions */}
      {(block.actions||[]).map((action, idx) => {
        const def = ACTION_TYPES.find(a => a.value === action.type);
        const groupColor = def ? GROUP_COLORS[def.group]||'#6366f1' : '#6366f1';
        return (
          <div key={idx}>
            <div className="block-chip block-action" style={{ background:`linear-gradient(135deg, ${groupColor}, ${groupColor}cc)` }}>
              <ArrowRight size={11}/>
              <GroupedSelect value={action.type} onChange={v => updateAction(idx, {type:v})} />
              <button style={{ background:'rgba(255,255,255,.15)', border:'none', borderRadius:4, color:'#fff', fontSize:10, cursor:'pointer', padding:'2px 5px', marginLeft:'auto', display:'flex', alignItems:'center' }} onClick={() => removeAction(idx)}>
                <X size={10}/>
              </button>
            </div>
            <ActionParams action={action} onChange={a => updateAction(idx, a)} screens={screens} />
          </div>
        );
      })}

      {/* Controls */}
      <div style={{ display:'flex', gap:5, marginTop:2 }}>
        <button className="block-add-action" onClick={addAction}>+ Ação</button>
        <button
          className="block-add-action"
          onClick={toggleCondition}
          style={{ borderColor: showCondition ? 'rgba(14,165,233,.4)':'rgba(255,255,255,.15)', color: showCondition ? '#38bdf8':'var(--text-3)' }}
        >
          {showCondition ? '✕ Condição' : '+ Se (If)'}
        </button>
      </div>
    </div>
  );
}

export default function BlockEditor({ onClose }) {
  const { getCurrentScreen, project, addBlock, updateBlock, deleteBlock } = useApp();
  const screen = getCurrentScreen();
  if (!screen) return null;

  const blocks = screen.blocks || [];
  const elements = screen.elements || [];

  return (
    <div className="block-editor">
      <div className="block-editor-header">
        <div className="block-editor-title">
          <Puzzle size={14}/> Linha de Lógica
          <span className="block-badge">BLOCOS</span>
          <span className="block-screen-name">— {screen.name}</span>
        </div>
        <div className="block-editor-btns">
          {EVENT_TYPES.slice(0,4).map(et => (
            <button key={et.value} className="btn btn-sm" onClick={() => addBlock({ event:et.value, elementId:'', actions:[], condition:null })} title={`Criar bloco: ${et.label}`}>
              <Plus size={11}/> {et.icon} {et.label.split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft:6 }}><X size={14}/></button>
      </div>

      <div className="block-editor-scroll">
        {blocks.length === 0 ? (
          <div className="block-editor-empty">
            <div className="block-editor-empty-icon"><Puzzle size={32} strokeWidth={1}/></div>
            <div className="block-editor-empty-text">
              <div className="title">Nenhum bloco de lógica</div>
              <div className="sub">7 eventos · 17 ações · condições If/Else disponíveis</div>
            </div>
          </div>
        ) : (
          blocks.map(block => (
            <BlockSequence
              key={block.id}
              block={block}
              elements={elements}
              screens={project.screens}
              onDelete={() => deleteBlock(block.id)}
              onUpdate={ch => updateBlock(block.id, ch)}
            />
          ))
        )}
      </div>
    </div>
  );
}
