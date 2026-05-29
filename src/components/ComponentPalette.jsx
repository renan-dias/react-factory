import React, { useState } from 'react';
import {
  Type, MousePointerClick, Image, FormInput, RectangleHorizontal,
  CreditCard, ToggleLeft, SlidersHorizontal, Sparkles, Minus,
  PanelTop, Search, Package, LayoutGrid, Boxes,
} from 'lucide-react';

const ICON_MAP = {
  Text: Type,
  Button: MousePointerClick,
  Image: Image,
  Input: FormInput,
  View: RectangleHorizontal,
  Card: CreditCard,
  Switch: ToggleLeft,
  Slider: SlidersHorizontal,
  Icon: Sparkles,
  Divider: Minus,
  SafeAreaView: PanelTop,
};

const CATEGORIES = {
  'básico':     { label: 'Básico',     icon: Package },
  'layout':     { label: 'Layout',     icon: Boxes },
  'formulário': { label: 'Formulário', icon: FormInput },
  'mídia':      { label: 'Mídia',      icon: Image },
};

import { COMPONENT_DEFS } from '../contexts/AppContext';

export default function ComponentPalette({ onShowTemplates }) {
  const [search, setSearch] = useState('');

  const byCategory = Object.entries(COMPONENT_DEFS).reduce((acc, [type, def]) => {
    const cat = def.category || 'básico';
    if (search && !def.label.toLowerCase().includes(search.toLowerCase()) && !type.toLowerCase().includes(search.toLowerCase())) return acc;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ type, ...def });
    return acc;
  }, {});

  const handleDragStart = (e, type) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('componentType', type);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Package size={13} />
          Estoque de Peças
        </div>
        <div className="sidebar-search">
          <Search size={13} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
          <input
            placeholder="Buscar componente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-scroll">
        <button className="sidebar-templates-btn" onClick={onShowTemplates}>
          <LayoutGrid size={14} />
          Usar Template de Tela
        </button>

        {Object.entries(CATEGORIES).map(([cat, catDef]) => {
          const items = byCategory[cat];
          if (!items || items.length === 0) return null;
          const CatIcon = catDef.icon;
          return (
            <div className="palette-category" key={cat}>
              <div className="palette-category-label">
                <CatIcon size={10} />
                {catDef.label}
              </div>
              <div className="palette-items">
                {items.map(item => {
                  const Icon = ICON_MAP[item.type] || Package;
                  return (
                    <div
                      key={item.type}
                      className="palette-item"
                      draggable
                      onDragStart={e => handleDragStart(e, item.type)}
                      title={`Arraste para adicionar: ${item.label}`}
                    >
                      <div className="palette-item-icon">
                        <Icon size={20} strokeWidth={1.5} />
                      </div>
                      <span className="palette-item-label">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-libs">
        <div className="sidebar-libs-title">Bibliotecas incluídas</div>
        {[
          '@expo/vector-icons',
          '@react-navigation',
          'expo-image-picker',
          'expo-secure-store',
        ].map(lib => (
          <div key={lib} className="lib-item">
            <div className="lib-dot" />
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: 10 }}>{lib}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
