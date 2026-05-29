import React, { useState } from 'react';
import {
  Type, MousePointerClick, Image, FormInput, Square, CreditCard,
  ToggleLeft, SlidersHorizontal, Sparkles, Minus, PanelTop,
  Search, Package, LayoutGrid, Boxes, Music2, Film, Camera,
  MapPin, PlusCircle, UserCircle2, Bell, TrendingUp, Star, Tag,
  CheckSquare, CloudSun, Newspaper, Globe, Cpu, Zap, CircleDot,
} from 'lucide-react';
import { COMPONENT_DEFS } from '../contexts/AppContext';

const ICON_MAP = {
  Text: Type, Button: MousePointerClick, Image, Input: FormInput,
  View: Square, Card: CreditCard, SafeAreaView: PanelTop, Divider: Minus,
  FAB: PlusCircle, Avatar: UserCircle2, Badge: Bell, ProgressBar: TrendingUp,
  Chip: Tag, Switch: ToggleLeft, Slider: SlidersHorizontal,
  Rating: Star, Checkbox: CheckSquare, Icon: Sparkles,
  Sound: Music2, Video: Film, Camera, MapView: MapPin,
  WeatherWidget: CloudSun, CryptoPrice: Zap, PokeCard: CircleDot,
  CountryCard: Globe, JokeCard: Music2, RandomUser: UserCircle2,
  NewsFeed: Newspaper, MovieCard: Film,
};

const CATEGORIES = {
  'básico':     { label:'Básico',           icon:Package },
  'layout':     { label:'Layout e UI',       icon:Boxes },
  'formulário': { label:'Formulário',        icon:FormInput },
  'mídia':      { label:'Mídia',             icon:Film },
  'câmera':     { label:'Câmera',            icon:Camera },
  'localização':{ label:'Localização / GPS', icon:MapPin },
  'api':        { label:'APIs Externas',     icon:Globe, isApi:true },
};

const API_FREE = { WeatherWidget:true, CryptoPrice:true, PokeCard:true, CountryCard:true, JokeCard:true, RandomUser:true };

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
        <div className="sidebar-title"><Cpu size={13} /> Estoque de Peças</div>
        <div className="sidebar-search">
          <Search size={13} style={{ color:'var(--text-3)', flexShrink:0 }} />
          <input placeholder="Buscar componente..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="sidebar-scroll">
        <button className="sidebar-templates-btn" onClick={onShowTemplates}>
          <LayoutGrid size={14} /> Usar Template de Tela
        </button>

        {Object.entries(CATEGORIES).map(([cat, catDef]) => {
          const items = byCategory[cat];
          if (!items || items.length === 0) return null;
          const CatIcon = catDef.icon;
          return (
            <div className="palette-category" key={cat}>
              <div className={`palette-category-label${catDef.isApi ? ' api-label' : ''}`}>
                <CatIcon size={10} />
                {catDef.label}
                {catDef.isApi && <span style={{ marginLeft:'auto', fontSize:8, background:'var(--success)', color:'#fff', padding:'1px 5px', borderRadius:3, fontWeight:800 }}>LIVE</span>}
              </div>
              <div className="palette-items">
                {items.map(item => {
                  const Icon = ICON_MAP[item.type] || Package;
                  const isApi = item.category === 'api';
                  const isFreeApi = API_FREE[item.type];
                  return (
                    <div
                      key={item.type}
                      className={`palette-item${isApi ? ' api-item' : ''}`}
                      draggable
                      onDragStart={e => handleDragStart(e, item.type)}
                      title={isApi ? `${item.label} — ${COMPONENT_DEFS[item.type]?.apiProvider}${isFreeApi ? ' (grátis, sem chave)' : ' (chave necessária)'}` : `Arrastar: ${item.label}`}
                    >
                      {isApi && <span className="api-badge">{isFreeApi ? 'FREE' : 'KEY'}</span>}
                      <div className="palette-item-icon"><Icon size={20} strokeWidth={1.5} /></div>
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
        <div className="sidebar-libs-title">Bibliotecas do projeto</div>
        {[
          { dot:'free', name:'open-meteo.com', desc:'Clima grátis' },
          { dot:'free', name:'pokeapi.co', desc:'Pokémon' },
          { dot:'free', name:'restcountries.com', desc:'Países' },
          { dot:'free', name:'v2.jokeapi.dev', desc:'Piadas' },
          { dot:'free', name:'coingecko.com/api', desc:'Cripto' },
          { dot:'key',  name:'newsapi.org', desc:'Notícias' },
          { dot:'key',  name:'themoviedb.org', desc:'Filmes' },
          { dot:'free', name:'@expo/vector-icons', desc:'Ícones' },
          { dot:'free', name:'react-native-maps', desc:'Mapas' },
          { dot:'free', name:'expo-av', desc:'Áudio/Vídeo' },
        ].map(lib => (
          <div key={lib.name} className="lib-item">
            <div className={`lib-dot ${lib.dot}`} title={lib.dot === 'free' ? 'Grátis / sem chave' : 'Chave de API necessária'} />
            <span style={{ fontFamily:'var(--mono)', fontSize:9 }}>{lib.name}</span>
            <span style={{ marginLeft:'auto', fontSize:9, color:'var(--text-3)' }}>{lib.desc}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
