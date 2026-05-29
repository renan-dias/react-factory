import React from 'react';
import { X, LayoutGrid, Plus } from 'lucide-react';
import { TEMPLATES, useApp } from '../contexts/AppContext';

function TemplateMiniPreview({ template }) {
  const blocks = template.preview || [];
  return (
    <div className="template-preview">
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(160deg, ${template.color}22 0%, transparent 60%)`,
      }} />
      <div className="template-preview-phone">
        <div className="template-preview-phone-inner" style={{ background: '#f5f5f5' }}>
          <div className="template-preview-notch">
            <div className="template-preview-notch-bar" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: 4, overflow: 'hidden' }}>
            {blocks.map((color, i) => (
              <div
                key={i}
                className="tpl-block"
                style={{
                  height: i === 0 ? 18 : i === blocks.length - 1 ? 14 : 12,
                  borderRadius: 3,
                  background: color,
                  opacity: 0.85,
                  marginLeft: i > 0 ? 4 : 0,
                  marginRight: i > 0 ? 4 : 0,
                }}
              />
            ))}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '2px 4px' }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} style={{ height: 10, borderRadius: 3, background: '#e5e7eb' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TemplateGallery({ onClose }) {
  const { applyTemplate } = useApp();

  const handleUse = (template) => {
    applyTemplate(template);
    onClose();
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="template-gallery" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <LayoutGrid size={20} />
          </div>
          <div>
            <div className="modal-title">Templates de Telas</div>
            <div className="modal-subtitle">Escolha um ponto de partida para sua tela</div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <X size={16} />
          </button>
        </div>

        <div className="template-grid">
          {TEMPLATES.map(template => (
            <div key={template.id} className="template-card">
              <TemplateMiniPreview template={template} />
              <div className="template-card-info">
                <div className="template-card-name">{template.name}</div>
                <div className="template-card-desc">{template.description}</div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}
                  onClick={() => handleUse(template)}
                >
                  <Plus size={13} />
                  Usar Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
