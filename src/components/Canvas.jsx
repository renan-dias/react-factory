import React, { useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronUp, ChevronDown, X, Cpu } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

function renderElementPreview(el) {
  const p = el.props;
  switch (el.type) {
    case 'Text':
      return (
        <div style={{
          fontSize: p.fontSize, color: p.color, fontWeight: p.fontWeight,
          textAlign: p.textAlign, fontFamily: 'system-ui',
          marginTop: p.marginTop, marginBottom: p.marginBottom,
          marginLeft: p.marginLeft, marginRight: p.marginRight,
        }}>
          {p.text}
        </div>
      );
    case 'Button':
      return (
        <div style={{ marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight }}>
          <div style={{
            backgroundColor: p.backgroundColor, borderRadius: p.borderRadius,
            paddingTop: p.paddingVertical, paddingBottom: p.paddingVertical,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <span style={{ color: p.textColor, fontSize: p.fontSize, fontWeight: 'bold', fontFamily: 'system-ui' }}>
              {p.label}
            </span>
          </div>
        </div>
      );
    case 'Image':
      return (
        <div style={{ marginTop: p.marginTop, marginBottom: p.marginBottom }}>
          <img
            src={p.source}
            alt=""
            style={{ width: '100%', height: p.height, objectFit: p.resizeMode === 'contain' ? 'contain' : p.resizeMode === 'stretch' ? 'fill' : 'cover', display: 'block' }}
            onError={e => { e.target.src = 'https://placehold.co/375x200?text=Imagem'; }}
          />
        </div>
      );
    case 'Input':
      return (
        <div style={{ marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight }}>
          <div style={{ border: `1px solid ${p.borderColor}`, borderRadius: p.borderRadius, paddingLeft: p.paddingHorizontal, paddingRight: p.paddingHorizontal, paddingTop: 10, paddingBottom: 10, background: p.backgroundColor || '#fff' }}>
            <span style={{ color: '#aaa', fontSize: p.fontSize, fontFamily: 'system-ui' }}>{p.placeholder}</span>
          </div>
        </div>
      );
    case 'View':
      return (
        <div style={{ backgroundColor: p.backgroundColor, height: p.height, borderRadius: p.borderRadius, padding: p.padding, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#aaa', fontSize: 11, fontFamily: 'system-ui' }}>{p.label}</span>
        </div>
      );
    case 'Card':
      return (
        <div style={{ backgroundColor: p.backgroundColor, borderRadius: p.borderRadius, padding: p.padding, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight, boxShadow: `0 2px 8px rgba(0,0,0,${p.shadowOpacity || 0.1})` }}>
          <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 5, color: '#1a1a1a', fontFamily: 'system-ui' }}>{p.title}</div>
          <div style={{ fontSize: 13, color: '#666', fontFamily: 'system-ui', lineHeight: 1.4 }}>{p.description}</div>
        </div>
      );
    case 'Switch':
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight }}>
          <span style={{ fontSize: 14, fontFamily: 'system-ui' }}>{p.label}</span>
          <div style={{ width: 48, height: 26, borderRadius: 13, backgroundColor: p.trackColor, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 3 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
          </div>
        </div>
      );
    case 'Slider':
      return (
        <div style={{ marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight }}>
          <div style={{ height: 4, borderRadius: 2, background: '#e2e8f0', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 2, background: p.minimumTrackTintColor, width: `${((p.value - p.minimumValue) / (p.maximumValue - p.minimumValue)) * 100}%` }} />
            <div style={{ position: 'absolute', left: `calc(${((p.value - p.minimumValue) / (p.maximumValue - p.minimumValue)) * 100}% - 10px)`, top: -8, width: 20, height: 20, borderRadius: '50%', background: '#fff', border: `2px solid ${p.minimumTrackTintColor}`, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      );
    case 'Icon': {
      const iconMap = { star: '★', heart: '♥', home: '⌂', user: '◉', search: '⊛', settings: '⚙', bell: '♪', camera: '⊡', phone: '☎', mail: '✉', check: '✓', close: '✕', plus: '+', minus: '−', arrow: '→', share: '↑', bookmark: '◈', edit: '✎', trash: '⊗', info: 'ℹ', lock: '⊝', map: '⊞', location: '⊙', calendar: '▦', clock: '◷', flag: '⚑', chart: '▨', music: '♫' };
      return (
        <div style={{ marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft }}>
          <span style={{ fontSize: p.size * 0.75, color: p.color, fontFamily: 'system-ui' }}>{iconMap[p.name] || '★'}</span>
        </div>
      );
    }
    case 'Divider':
      return (
        <div style={{ height: p.thickness, backgroundColor: p.color, marginTop: p.marginTop, marginBottom: p.marginBottom, marginLeft: p.marginLeft, marginRight: p.marginRight }} />
      );
    case 'SafeAreaView':
      return (
        <div style={{ backgroundColor: p.backgroundColor, paddingTop: p.paddingVertical, paddingBottom: p.paddingVertical, paddingLeft: 16, paddingRight: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {p.title && <span style={{ color: '#fff', fontSize: 17, fontWeight: 'bold', fontFamily: 'system-ui' }}>{p.title}</span>}
        </div>
      );
    default:
      return <div style={{ padding: 8, fontSize: 11, color: '#aaa' }}>[{el.type}]</div>;
  }
}

function CanvasEl({ el, isSelected, onClick, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div
      className={`canvas-el${isSelected ? ' selected' : ''}`}
      onClick={e => { e.stopPropagation(); onClick(); }}
    >
      <div className="canvas-el-overlay" />
      <div className="canvas-el-tag">{el.type}</div>
      <div className="canvas-el-actions">
        {!isFirst && (
          <button className="el-action-btn" onClick={e => { e.stopPropagation(); onMoveUp(); }} title="Mover para cima">
            <ChevronUp size={11} />
          </button>
        )}
        {!isLast && (
          <button className="el-action-btn" onClick={e => { e.stopPropagation(); onMoveDown(); }} title="Mover para baixo">
            <ChevronDown size={11} />
          </button>
        )}
        <button className="el-action-btn danger" onClick={e => { e.stopPropagation(); onDelete(); }} title="Remover elemento">
          <X size={10} />
        </button>
      </div>
      {renderElementPreview(el)}
    </div>
  );
}

function isLightColor(hex) {
  if (!hex || hex.length < 6) return true;
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

export default function Canvas() {
  const { getCurrentScreen, addElement, deleteElement, selectElement, reorderElements, project, updateScreenProp } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const phoneRef = useRef();
  const screen = getCurrentScreen();

  if (!screen) return null;

  const elements = screen.elements || [];
  const selectedId = project.selectedElementId;
  const light = isLightColor(screen.backgroundColor);
  const statusColor = light ? '#1a1a1a' : '#ffffff';

  const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setIsDragOver(true); };
  const handleDragLeave = (e) => { if (!phoneRef.current?.contains(e.relatedTarget)) setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault(); setIsDragOver(false);
    const type = e.dataTransfer.getData('componentType');
    if (type) addElement(type);
  };

  const moveUp = (idx) => {
    if (idx === 0) return;
    const a = [...elements]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; reorderElements(a);
  };
  const moveDown = (idx) => {
    if (idx === elements.length - 1) return;
    const a = [...elements]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; reorderElements(a);
  };

  const zoomIn  = () => setZoom(z => Math.min(2, parseFloat((z + 0.1).toFixed(1))));
  const zoomOut = () => setZoom(z => Math.max(0.4, parseFloat((z - 0.1).toFixed(1))));
  const zoomReset = () => setZoom(1);

  return (
    <main className="canvas-area" onClick={() => selectElement(null)}>
      <div className="canvas-toolbar">
        <div className="canvas-info">
          <div className="canvas-badge">
            <Cpu size={11} />
            Linha de Montagem
          </div>
          <span className="canvas-screen-info">
            <strong>{screen.name}</strong> &middot; {elements.length} componente{elements.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="bg-swatch-row">
          <span className="bg-swatch-label">Fundo</span>
          <input
            type="color"
            className="bg-color-input"
            value={screen.backgroundColor}
            onChange={e => updateScreenProp('backgroundColor', e.target.value)}
            title="Cor de fundo da tela"
          />
        </div>

        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomOut} disabled={zoom <= 0.4} title="Reduzir zoom">
            <ZoomOut size={13} />
          </button>
          <span className="zoom-value">{Math.round(zoom * 100)}%</span>
          <button className="zoom-btn" onClick={zoomIn} disabled={zoom >= 2} title="Aumentar zoom">
            <ZoomIn size={13} />
          </button>
          <button className="zoom-btn" onClick={zoomReset} title="Resetar zoom (100%)">
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      <div className="phone-zoom-wrapper" style={{ transform: `scale(${zoom})` }}>
        <div className="phone-frame">
          <div className="phone-notch">
            <div className="phone-notch-camera" />
            <div className="phone-notch-speaker" />
          </div>
          <div className="phone-btn-l1" />
          <div className="phone-btn-l2" />
          <div className="phone-btn-l3" />
          <div className="phone-btn-r1" />

          <div className="phone-inner" style={{ background: screen.backgroundColor }}>
            <div className="phone-status-bar" style={{ background: screen.backgroundColor, color: statusColor }}>
              <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'system-ui' }}>9:41</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontFamily: 'system-ui' }}>▶▶ ▌▌▌▌</span>
              </div>
            </div>

            <div
              ref={phoneRef}
              className={`phone-content${isDragOver ? ' drop-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {elements.length === 0 ? (
                <div className="canvas-drop-hint">
                  <div className="canvas-drop-hint-icon">
                    <Cpu size={36} strokeWidth={1} />
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Linha de Montagem vazia</div>
                  <div style={{ fontSize: 12 }}>Arraste componentes do Estoque para cá</div>
                </div>
              ) : (
                elements.map((el, idx) => (
                  <CanvasEl
                    key={el.id}
                    el={el}
                    isSelected={selectedId === el.id}
                    onClick={() => selectElement(el.id)}
                    onDelete={() => deleteElement(el.id)}
                    onMoveUp={() => moveUp(idx)}
                    onMoveDown={() => moveDown(idx)}
                    isFirst={idx === 0}
                    isLast={idx === elements.length - 1}
                  />
                ))
              )}
            </div>

            <div className="phone-home-bar">
              <div className="phone-home-bar-indicator" style={{ background: `${statusColor}40` }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
