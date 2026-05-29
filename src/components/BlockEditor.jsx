import React from 'react';
import { Puzzle, Plus, X, Zap, ArrowRight, GitBranch } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const EVENT_TYPES = [
  { value: 'onPress',   label: 'Ao pressionar', hasElement: true },
  { value: 'onMount',   label: 'Ao abrir tela',  hasElement: false },
  { value: 'onChange',  label: 'Ao digitar em',  hasElement: true },
  { value: 'onLongPress', label: 'Ao segurar',   hasElement: true },
];

const ACTION_TYPES = [
  { value: 'navigate',  label: 'Navegar para' },
  { value: 'alert',     label: 'Mostrar alerta' },
  { value: 'log',       label: 'Console.log' },
  { value: 'setState',  label: 'Definir variável' },
];

function ChipSelect({ value, options, onChange, style }) {
  return (
    <select className="block-chip-select" value={value} onChange={e => onChange(e.target.value)} style={style}>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  );
}

function ChipInput({ value, onChange, placeholder, style }) {
  return (
    <input className="block-chip-input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />
  );
}

function BlockSequence({ block, onDelete, onUpdate, elements, screens }) {
  const eventDef = EVENT_TYPES.find(e => e.value === block.event) || EVENT_TYPES[0];

  const addAction = () => onUpdate({ actions: [...(block.actions || []), { type: 'navigate', screen: '', message: '', variable: '', value: '' }] });
  const updateAction = (idx, changes) => {
    const actions = [...(block.actions || [])];
    actions[idx] = { ...actions[idx], ...changes };
    onUpdate({ actions });
  };
  const removeAction = (idx) => onUpdate({ actions: (block.actions || []).filter((_, i) => i !== idx) });

  return (
    <div className="block-sequence">
      <button className="block-seq-del" onClick={onDelete} title="Remover bloco">
        <X size={13} />
      </button>

      {/* Event */}
      <div className="block-chip block-event">
        <Zap size={12} />
        <ChipSelect
          value={block.event}
          options={EVENT_TYPES.map(e => ({ value: e.value, label: e.label }))}
          onChange={v => onUpdate({ event: v })}
        />
        {eventDef.hasElement && (
          <ChipSelect
            value={block.elementId || ''}
            options={[{ value: '', label: 'Elemento...' }, ...elements.map(el => ({ value: el.id, label: `${el.props.label || el.props.text || el.type}` }))]}
            onChange={v => onUpdate({ elementId: v })}
          />
        )}
      </div>

      {/* Actions */}
      {(block.actions || []).map((action, idx) => (
        <div key={idx} className="block-chip block-action">
          <ArrowRight size={11} />
          <ChipSelect
            value={action.type}
            options={ACTION_TYPES.map(a => ({ value: a.value, label: a.label }))}
            onChange={v => updateAction(idx, { type: v })}
          />
          {action.type === 'navigate' && (
            <ChipSelect
              value={action.screen || ''}
              options={[{ value: '', label: 'Tela...' }, ...screens.map(s => ({ value: s.name, label: s.name }))]}
              onChange={v => updateAction(idx, { screen: v })}
            />
          )}
          {(action.type === 'alert' || action.type === 'log') && (
            <ChipInput value={action.message} onChange={v => updateAction(idx, { message: v })} placeholder="mensagem..." />
          )}
          {action.type === 'setState' && (
            <>
              <ChipInput value={action.variable} onChange={v => updateAction(idx, { variable: v })} placeholder="variável" style={{ maxWidth: 70 }} />
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>=</span>
              <ChipInput value={action.value} onChange={v => updateAction(idx, { value: v })} placeholder="valor" style={{ maxWidth: 70 }} />
            </>
          )}
          <button style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 4, color: '#fff', fontSize: 10, cursor: 'pointer', padding: '2px 5px', marginLeft: 'auto', display: 'flex', alignItems: 'center' }} onClick={() => removeAction(idx)}>
            <X size={10} />
          </button>
        </div>
      ))}

      <button className="block-add-action" onClick={addAction}>
        + Adicionar ação
      </button>
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
          <Puzzle size={14} />
          Linha de Lógica
          <span className="block-badge">BLOCOS</span>
          <span className="block-screen-name">— {screen.name}</span>
        </div>
        <div className="block-editor-btns">
          {EVENT_TYPES.map(et => (
            <button key={et.value} className="btn btn-sm" onClick={() => addBlock({ event: et.value, elementId: '', actions: [] })}>
              <Plus size={11} /> {et.label.split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft: 6 }}>
          <X size={14} />
        </button>
      </div>

      <div className="block-editor-scroll">
        {blocks.length === 0 ? (
          <div className="block-editor-empty">
            <div className="block-editor-empty-icon"><Puzzle size={32} strokeWidth={1} /></div>
            <div className="block-editor-empty-text">
              <div className="title">Nenhum bloco de lógica</div>
              <div className="sub">Use os botões acima para criar eventos e ações visuais</div>
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
              onUpdate={changes => updateBlock(block.id, changes)}
            />
          ))
        )}
      </div>
    </div>
  );
}
