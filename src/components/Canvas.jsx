import React, { useRef, useState, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, ChevronUp, ChevronDown, X, Cpu } from 'lucide-react';
import { useApp, COMPONENT_DEFS } from '../contexts/AppContext';

// ── PREVIEW RENDERERS ──────────────────────────────────────
function renderPreview(el) {
  const p = el.props;
  const sys = { fontFamily:'system-ui' };

  switch (el.type) {
    case 'Text':
      return <div style={{ fontSize:p.fontSize, color:p.color, fontWeight:p.fontWeight, textAlign:p.textAlign, ...sys, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>{p.text}</div>;

    case 'Button':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ backgroundColor:p.backgroundColor, borderRadius:p.borderRadius, paddingTop:p.paddingVertical, paddingBottom:p.paddingVertical, display:'flex', justifyContent:'center', alignItems:'center' }}>
            <span style={{ color:p.textColor, fontSize:p.fontSize, fontWeight:'bold', ...sys }}>{p.label}</span>
          </div>
        </div>
      );

    case 'Image':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom }}>
          <img src={p.source} alt="" style={{ width:'100%', height:p.height, objectFit:p.resizeMode==='contain'?'contain':p.resizeMode==='stretch'?'fill':'cover', display:'block' }}
            onError={e => { e.target.src='https://placehold.co/375x200?text=Imagem'; }} />
        </div>
      );

    case 'Input':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ border:`1px solid ${p.borderColor}`, borderRadius:p.borderRadius, paddingLeft:p.paddingHorizontal, paddingRight:p.paddingHorizontal, paddingTop:10, paddingBottom:10, background:p.backgroundColor||'#fff' }}>
            <span style={{ color:'#aaa', fontSize:p.fontSize, ...sys }}>{p.placeholder}</span>
          </div>
        </div>
      );

    case 'View':
      return <div style={{ backgroundColor:p.backgroundColor, height:p.height, borderRadius:p.borderRadius, padding:p.padding, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ color:'#aaa', fontSize:11, ...sys }}>{p.label}</span></div>;

    case 'Card':
      return (
        <div style={{ backgroundColor:p.backgroundColor, borderRadius:p.borderRadius, padding:p.padding, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, boxShadow:`0 2px 8px rgba(0,0,0,${p.shadowOpacity||.1})` }}>
          <div style={{ fontSize:15, fontWeight:'bold', marginBottom:5, color:'#1a1a1a', ...sys }}>{p.title}</div>
          <div style={{ fontSize:13, color:'#666', ...sys, lineHeight:1.4 }}>{p.description}</div>
        </div>
      );

    case 'SafeAreaView':
      return <div style={{ backgroundColor:p.backgroundColor, paddingTop:p.paddingVertical, paddingBottom:p.paddingVertical, paddingLeft:16, paddingRight:16, display:'flex', alignItems:'center', justifyContent:'center' }}>{p.title&&<span style={{ color:'#fff', fontSize:17, fontWeight:'bold', ...sys }}>{p.title}</span>}</div>;

    case 'Divider':
      return <div style={{ height:p.thickness, backgroundColor:p.color, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }} />;

    case 'Switch':
      return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <span style={{ fontSize:14, ...sys }}>{p.label}</span>
          <div style={{ width:48, height:26, borderRadius:13, backgroundColor:p.trackColor, display:'flex', alignItems:'center', justifyContent:'flex-end', padding:3 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', backgroundColor:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.3)' }} />
          </div>
        </div>
      );

    case 'Slider':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ height:4, borderRadius:2, background:'#e2e8f0', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, height:'100%', borderRadius:2, background:p.minimumTrackTintColor, width:`${((p.value-p.minimumValue)/(p.maximumValue-p.minimumValue))*100}%` }} />
            <div style={{ position:'absolute', left:`calc(${((p.value-p.minimumValue)/(p.maximumValue-p.minimumValue))*100}% - 10px)`, top:-8, width:20, height:20, borderRadius:'50%', background:'#fff', border:`2px solid ${p.minimumTrackTintColor}`, boxShadow:'0 1px 4px rgba(0,0,0,.2)' }} />
          </div>
        </div>
      );

    case 'Icon': {
      const icons = { star:'★',heart:'♥',home:'⌂',user:'◉',search:'⊛',settings:'⚙',bell:'♪',camera:'⊡',phone:'☎',mail:'✉',check:'✓',close:'✕',plus:'+',minus:'−',arrow:'→',share:'↑',bookmark:'◈',edit:'✎',trash:'⊗',info:'ℹ',lock:'⊝',map:'⊞',location:'⊙',calendar:'▦',clock:'◷',flag:'⚑' };
      return <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft }}><span style={{ fontSize:p.size*.78, color:p.color, ...sys }}>{icons[p.name]||'★'}</span></div>;
    }

    case 'FAB':
      return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', marginBottom:8, paddingRight:p.rightOffset||24 }}>
          <div style={{ width:p.size, height:p.size, borderRadius:p.size/2, backgroundColor:p.backgroundColor, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 12px rgba(0,0,0,.2)' }}>
            <span style={{ color:p.iconColor, fontSize:24, fontWeight:'bold', ...sys }}>+</span>
          </div>
          <span style={{ fontSize:9, color:'#aaa', marginTop:3, ...sys }}>Botão flutuante</span>
        </div>
      );

    case 'Avatar': {
      const initials = (p.name||'').split(' ').map(n=>n[0]||'').slice(0,2).join('').toUpperCase();
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft }}>
          {p.source ? (
            <img src={p.source} alt={p.name} style={{ width:p.size, height:p.size, borderRadius:p.borderRadius||p.size/2, objectFit:'cover' }} />
          ) : (
            <div style={{ width:p.size, height:p.size, borderRadius:p.borderRadius||p.size/2, backgroundColor:p.backgroundColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:p.textColor, fontSize:p.size*.38, fontWeight:'bold', ...sys }}>{initials}</span>
            </div>
          )}
        </div>
      );
    }

    case 'Badge':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, display:'inline-flex', alignItems:'center' }}>
          <div style={{ backgroundColor:p.backgroundColor, borderRadius:12, paddingLeft:8, paddingRight:8, paddingTop:3, paddingBottom:3, display:'inline-flex' }}>
            <span style={{ color:p.textColor, fontSize:p.fontSize, fontWeight:'bold', ...sys }}>{p.text}</span>
          </div>
        </div>
      );

    case 'ProgressBar':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          {p.showLabel && <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}><span style={{ fontSize:11, color:'#666', ...sys }}>{p.label}</span><span style={{ fontSize:11, fontWeight:'bold', color:p.color, ...sys }}>{Math.round(p.progress*100)}%</span></div>}
          <div style={{ height:p.height, borderRadius:p.borderRadius, background:p.trackColor, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${p.progress*100}%`, background:p.color, borderRadius:p.borderRadius, transition:'width .3s' }} />
          </div>
        </div>
      );

    case 'Rating':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, display:'flex', gap:3 }}>
          {Array.from({ length:p.maxRating }).map((_,i) => (
            <span key={i} style={{ fontSize:p.size*.8, color:i<p.defaultRating?p.activeColor:p.inactiveColor, ...sys }}>★</span>
          ))}
        </div>
      );

    case 'Chip':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, display:'inline-flex' }}>
          <div style={{ backgroundColor:p.backgroundColor, border:`1px solid ${p.textColor}22`, borderRadius:p.borderRadius, paddingLeft:p.paddingH||12, paddingRight:p.paddingH||12, paddingTop:p.paddingV||5, paddingBottom:p.paddingV||5, display:'inline-flex' }}>
            <span style={{ color:p.textColor, fontSize:p.fontSize, fontWeight:600, ...sys }}>{p.label}</span>
          </div>
        </div>
      );

    case 'Checkbox':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:20, height:20, borderRadius:5, border:`2px solid ${p.borderColor}`, backgroundColor:p.checked?p.checkColor:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {p.checked && <span style={{ color:'#fff', fontSize:13, fontWeight:'bold', ...sys }}>✓</span>}
          </div>
          <span style={{ fontSize:p.fontSize, ...sys }}>{p.label}</span>
        </div>
      );

    case 'Sound':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#1e293b', borderRadius:14, padding:'12px 16px', marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:44, height:44, borderRadius:10, background:p.accentColor||'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'#fff', fontSize:20, ...sys }}>♪</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:p.textColor||'#fff', fontSize:14, fontWeight:'bold', ...sys }}>{p.title}</div>
              <div style={{ color:'rgba(255,255,255,.55)', fontSize:11, ...sys, marginTop:2 }}>{p.artist}</div>
            </div>
          </div>
          <div style={{ marginTop:12, height:4, borderRadius:2, background:'rgba(255,255,255,.12)', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, height:'100%', width:'35%', background:p.accentColor||'#6366f1', borderRadius:2 }} />
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:28, marginTop:12 }}>
            {['⏮','▶','⏭'].map(c => <span key={c} style={{ color:c==='▶'?p.accentColor||'#6366f1':'rgba(255,255,255,.55)', fontSize:c==='▶'?22:16, cursor:'pointer', ...sys }}>{c}</span>)}
          </div>
        </div>
      );

    case 'Video':
      return (
        <div style={{ height:p.height, background:'#000', position:'relative', marginTop:p.marginTop, marginBottom:p.marginBottom, overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8 }}>
            <div style={{ width:52, height:52, borderRadius:26, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontSize:22, ...sys }}>▶</span>
            </div>
            <span style={{ color:'rgba(255,255,255,.5)', fontSize:11, ...sys }}>Player de Vídeo</span>
          </div>
          <div style={{ position:'absolute', bottom:8, left:16, right:16, height:3, borderRadius:2, background:'rgba(255,255,255,.2)' }}>
            <div style={{ height:'100%', width:'30%', background:'#fff', borderRadius:2 }} />
          </div>
        </div>
      );

    case 'Camera':
      return (
        <div style={{ height:p.height, background:'#0f172a', marginTop:p.marginTop, marginBottom:p.marginBottom, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:10 }}>
          <div style={{ position:'absolute', inset:8, border:'2px dashed rgba(255,255,255,.15)', borderRadius:12 }} />
          <div style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'rgba(255,255,255,.5)', fontSize:22, ...sys }}>⊡</span>
          </div>
          <span style={{ color:'rgba(255,255,255,.4)', fontSize:12, ...sys }}>Câmera — {p.facing==='back'?'Traseira':'Frontal'}</span>
          {p.showCaptureButton && (
            <div style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', width:52, height:52, borderRadius:26, border:'3px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ width:40, height:40, borderRadius:20, background:'#fff' }} />
            </div>
          )}
        </div>
      );

    case 'MapView':
      return (
        <div style={{ height:p.height, overflow:'hidden', marginTop:p.marginTop, marginBottom:p.marginBottom, position:'relative', background:'#e8edf0' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(100,150,200,.25) 1px,transparent 1px),linear-gradient(90deg,rgba(100,150,200,.25) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
          <div style={{ position:'absolute', top:'42%', left:0, right:0, height:6, background:'rgba(255,255,255,.7)' }} />
          <div style={{ position:'absolute', left:'38%', top:0, bottom:0, width:6, background:'rgba(255,255,255,.7)' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-100%)', fontSize:28, filter:'drop-shadow(0 2px 4px rgba(0,0,0,.3))', ...sys }}>📍</div>
          {p.markerTitle && <div style={{ position:'absolute', top:'calc(50% - 40px)', left:'50%', transform:'translateX(-50%)', background:'#fff', padding:'2px 8px', borderRadius:6, fontSize:11, fontWeight:'bold', ...sys, whiteSpace:'nowrap', boxShadow:'0 2px 6px rgba(0,0,0,.2)' }}>{p.markerTitle}</div>}
          <div style={{ position:'absolute', bottom:4, right:8, fontSize:8, color:'#666', ...sys }}>© Google Maps</div>
        </div>
      );

    // ── API COMPONENTS ────────────────────────────────────────
    case 'WeatherWidget':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#0ea5e9', borderRadius:p.borderRadius||16, padding:20, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ color:p.textColor||'#fff', fontSize:12, opacity:.8, ...sys }}>{p.city}</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:10, marginTop:6 }}>
            <span style={{ fontSize:44, lineHeight:1, ...sys }}>⛅</span>
            <div>
              <div style={{ color:p.textColor||'#fff', fontSize:42, fontWeight:'bold', lineHeight:1, ...sys }}>25°</div>
              <div style={{ color:p.textColor||'#fff', fontSize:12, opacity:.8, ...sys }}>Parcialmente nublado</div>
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, color:p.textColor||'#fff', fontSize:10, opacity:.65, ...sys }}>
            <span>Umidade 65%</span><span>Vento 12 km/h</span><span>UV: 6</span>
          </div>
          <ApiBar provider="Open-Meteo" free />
        </div>
      );

    case 'CryptoPrice':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#f59e0b', borderRadius:p.borderRadius||14, padding:18, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ color:p.textColor||'#fff', fontSize:12, opacity:.8, ...sys }}>{p.coinName||'Bitcoin'}</div>
              <div style={{ color:p.textColor||'#fff', fontSize:32, fontWeight:'bold', ...sys }}>$67.420</div>
            </div>
            <span style={{ fontSize:36, ...sys }}>₿</span>
          </div>
          <div style={{ color:p.textColor||'#fff', fontSize:11, marginTop:8, opacity:.7, ...sys }}>▲ +2,4% nas últimas 24h</div>
          <ApiBar provider="CoinGecko" free />
        </div>
      );

    case 'PokeCard':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#4ade80', borderRadius:p.borderRadius||14, padding:16, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, display:'flex', alignItems:'center', gap:14 }}>
          <span style={{ fontSize:56, ...sys }}>🌿</span>
          <div>
            <div style={{ color:p.textColor||'#fff', fontSize:11, opacity:.8, ...sys }}>#001</div>
            <div style={{ color:p.textColor||'#fff', fontSize:20, fontWeight:'bold', ...sys, textTransform:'capitalize' }}>{p.pokemonName||'bulbasaur'}</div>
            <div style={{ display:'flex', gap:6, marginTop:4 }}>
              {['grass','poison'].map(t => <span key={t} style={{ fontSize:10, background:'rgba(255,255,255,.25)', color:'#fff', padding:'2px 7px', borderRadius:10, ...sys }}>{t}</span>)}
            </div>
          </div>
          <ApiBar provider="PokéAPI" free right />
        </div>
      );

    case 'CountryCard':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#fff', borderRadius:p.borderRadius||14, padding:16, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, boxShadow:'0 2px 8px rgba(0,0,0,.08)', display:'flex', gap:14, alignItems:'center' }}>
          <span style={{ fontSize:44, ...sys }}>🇧🇷</span>
          <div>
            <div style={{ fontWeight:'bold', fontSize:16, ...sys }}>{p.country||'Brazil'}</div>
            <div style={{ fontSize:12, color:'#666', ...sys, marginTop:2 }}>Capital: Brasília</div>
            <div style={{ fontSize:12, color:'#666', ...sys }}>Pop: 215 milhões</div>
          </div>
          <ApiBar provider="RestCountries" free right />
        </div>
      );

    case 'JokeCard':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#fef3c7', borderRadius:p.borderRadius||14, padding:16, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight }}>
          <div style={{ fontSize:11, fontWeight:'bold', color:'#78350f', marginBottom:8, ...sys }}>😄 Piada aleatória</div>
          <div style={{ fontSize:13, color:p.textColor||'#92400e', lineHeight:1.5, ...sys }}>Por que os programadores confundem Halloween e Natal? Porque Oct 31 = Dec 25!</div>
          <div style={{ marginTop:10, textAlign:'right' }}>
            <span style={{ fontSize:11, background:'#f59e0b', color:'#fff', padding:'3px 10px', borderRadius:8, ...sys }}>{p.buttonLabel||'Nova piada'}</span>
          </div>
          <ApiBar provider="JokeAPI" free />
        </div>
      );

    case 'RandomUser':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#fff', borderRadius:p.borderRadius||14, padding:16, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, boxShadow:'0 2px 8px rgba(0,0,0,.08)', display:'flex', gap:14, alignItems:'center' }}>
          <div style={{ width:56, height:56, borderRadius:28, background:'linear-gradient(135deg,#6366f1,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontSize:28, ...sys }}>👤</span>
          </div>
          <div>
            <div style={{ fontWeight:'bold', fontSize:15, ...sys }}>Maria Silva</div>
            <div style={{ fontSize:12, color:'#666', ...sys }}>maria@email.com</div>
            <div style={{ fontSize:11, color:'#999', ...sys }}>São Paulo, BR</div>
          </div>
          <ApiBar provider="RandomUser" free right />
        </div>
      );

    case 'NewsFeed':
      return (
        <div style={{ marginTop:p.marginTop, marginBottom:p.marginBottom }}>
          {[
            { title:'Nova atualização do React Native 0.74 chega com melhorias de performance', source:'TechBlog', time:'2h' },
            { title:'Expo SDK 52: o que há de novo para desenvolvedores mobile', source:'Expo News', time:'5h' },
            { title:'10 melhores práticas para apps React Native em 2025', source:'Dev.to', time:'1d' },
          ].slice(0, p.pageSize||3).map((n, i) => (
            <div key={i} style={{ backgroundColor:p.backgroundColor||'#fff', borderRadius:p.borderRadius||14, padding:12, marginBottom:8, marginLeft:16, marginRight:16, boxShadow:'0 1px 4px rgba(0,0,0,.06)' }}>
              <div style={{ fontSize:12, fontWeight:'bold', lineHeight:1.4, color:'#1a1a1a', ...sys }}>{n.title}</div>
              <div style={{ display:'flex', gap:8, marginTop:6 }}>
                <span style={{ fontSize:10, color:'#6366f1', fontWeight:'bold', ...sys }}>{n.source}</span>
                <span style={{ fontSize:10, color:'#999', ...sys }}>{n.time} atrás</span>
              </div>
            </div>
          ))}
          <ApiBar provider="NewsAPI" right style={{ marginRight:16 }} />
        </div>
      );

    case 'MovieCard':
      return (
        <div style={{ backgroundColor:p.backgroundColor||'#1e293b', borderRadius:p.borderRadius||14, height:p.height||200, marginTop:p.marginTop, marginBottom:p.marginBottom, marginLeft:p.marginLeft, marginRight:p.marginRight, overflow:'hidden', position:'relative', display:'flex', alignItems:'flex-end' }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#1e3a5f,#0f172a)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:44, ...sys }}>🎬</span>
          </div>
          <div style={{ position:'relative', padding:14, background:'linear-gradient(to top,rgba(0,0,0,.8),transparent)', width:'100%' }}>
            <div style={{ color:'#fff', fontSize:14, fontWeight:'bold', ...sys }}>Avengers: Infinity War</div>
            <div style={{ display:'flex', gap:8, marginTop:3 }}>
              <span style={{ fontSize:10, color:'#f59e0b', ...sys }}>★ 8.4</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,.5)', ...sys }}>Ação · 2018</span>
            </div>
          </div>
          <ApiBar provider="TMDB" right style={{ position:'absolute', top:8, right:8 }} />
        </div>
      );

    default:
      return <div style={{ padding:8, fontSize:11, color:'#aaa', ...sys }}>[{el.type}]</div>;
  }
}

function ApiBar({ provider, free, right, style }) {
  return (
    <div style={{ marginTop:8, display:'flex', alignItems:'center', justifyContent:right?'flex-end':'flex-start', gap:4, ...style }}>
      <span style={{ fontSize:8, background:free?'rgba(52,211,153,.15)':'rgba(245,158,11,.15)', color:free?'#059669':'#d97706', border:`1px solid ${free?'rgba(52,211,153,.3)':'rgba(245,158,11,.3)'}`, padding:'1px 6px', borderRadius:4, fontWeight:700, fontFamily:'system-ui' }}>
        {free?'FREE':'KEY'} · {provider}
      </span>
    </div>
  );
}

// ── CANVAS ELEMENT WRAPPER ─────────────────────────────────
function CanvasEl({ el, isSelected, onClick, onDelete, onMoveUp, onMoveDown, isFirst, isLast, onDragStartEl, onDragOverEl, onDropEl, isDragTarget }) {
  const isApi = el.type && COMPONENT_DEFS[el.type]?.category === 'api';

  return (
    <div
      className={`canvas-el${isSelected?' selected':''}${isApi?' api-el':''}`}
      onClick={e => { e.stopPropagation(); onClick(); }}
      draggable
      onDragStart={e => { e.stopPropagation(); onDragStartEl(e); }}
      onDragOver={e => { e.preventDefault(); e.stopPropagation(); onDragOverEl(); }}
      onDrop={e => { e.preventDefault(); e.stopPropagation(); onDropEl(); }}
      style={{ opacity: isDragTarget ? 0.45 : 1, transition:'opacity .15s' }}
    >
      <div className="canvas-el-overlay" />
      <div className="canvas-el-tag">{el.type}{isApi?' 🔗':''}</div>
      <div className="canvas-el-actions">
        {!isFirst && <button className="el-action-btn" onClick={e => { e.stopPropagation(); onMoveUp(); }}><ChevronUp size={11}/></button>}
        {!isLast  && <button className="el-action-btn" onClick={e => { e.stopPropagation(); onMoveDown(); }}><ChevronDown size={11}/></button>}
        <button className="el-action-btn danger" onClick={e => { e.stopPropagation(); onDelete(); }}><X size={10}/></button>
      </div>
      {renderPreview(el)}
    </div>
  );
}

function isLight(hex) {
  if (!hex || hex.length < 7) return true;
  const h = hex.replace('#','');
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return (r*299+g*587+b*114)/1000 > 128;
}

// ── MAIN CANVAS ───────────────────────────────────────────
export default function Canvas() {
  const { getCurrentScreen, addElement, deleteElement, selectElement, reorderElements, project, updateScreenProp } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropIndex, setDropIndex] = useState(null);
  const phoneRef = useRef();
  const screen = getCurrentScreen();
  if (!screen) return null;

  const elements = screen.elements || [];
  const selectedId = project.selectedElementId;
  const light = isLight(screen.backgroundColor);
  const statusColor = light ? '#1a1a1a' : '#ffffff';

  // Drop from palette
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.dataTransfer.dropEffect='copy'; setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e) => { if (!phoneRef.current?.contains(e.relatedTarget)) setIsDragOver(false); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragOver(false);
    const type = e.dataTransfer.getData('componentType');
    if (type) addElement(type);
  }, [addElement]);

  // Internal drag-and-drop reordering
  const handleElDragStart = useCallback((idx) => { setDragIndex(idx); }, []);
  const handleElDragOver = useCallback((idx) => { if (dragIndex !== null && idx !== dragIndex) setDropIndex(idx); }, [dragIndex]);
  const handleElDrop = useCallback((idx) => {
    if (dragIndex === null || dragIndex === idx) { setDragIndex(null); setDropIndex(null); return; }
    const arr = [...elements];
    const [moved] = arr.splice(dragIndex, 1);
    arr.splice(idx, 0, moved);
    reorderElements(arr);
    selectElement(moved.id);
    setDragIndex(null); setDropIndex(null);
  }, [dragIndex, elements, reorderElements, selectElement]);

  const moveUp   = (idx) => { if(idx===0) return; const a=[...elements]; [a[idx-1],a[idx]]=[a[idx],a[idx-1]]; reorderElements(a); };
  const moveDown = (idx) => { if(idx===elements.length-1) return; const a=[...elements]; [a[idx],a[idx+1]]=[a[idx+1],a[idx]]; reorderElements(a); };
  const zoomIn   = () => setZoom(z => Math.min(2, parseFloat((z+.1).toFixed(1))));
  const zoomOut  = () => setZoom(z => Math.max(.4, parseFloat((z-.1).toFixed(1))));

  return (
    <main className="canvas-area" onClick={() => selectElement(null)}>
      <div className="canvas-toolbar">
        <div className="canvas-info">
          <div className="canvas-badge"><Cpu size={11}/> Linha de Montagem</div>
          <span className="canvas-screen-info"><strong>{screen.name}</strong> · {elements.length} componente{elements.length!==1?'s':''}</span>
        </div>
        <div className="bg-swatch-row">
          <span className="bg-swatch-label">Fundo</span>
          <input type="color" className="bg-color-input" value={screen.backgroundColor} onChange={e => updateScreenProp('backgroundColor', e.target.value)} title="Cor de fundo" />
        </div>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={zoomOut} disabled={zoom<=.4}><ZoomOut size={13}/></button>
          <span className="zoom-value">{Math.round(zoom*100)}%</span>
          <button className="zoom-btn" onClick={zoomIn} disabled={zoom>=2}><ZoomIn size={13}/></button>
          <button className="zoom-btn" onClick={() => setZoom(1)} title="Resetar zoom"><RotateCcw size={12}/></button>
        </div>
      </div>

      <div className="phone-zoom-wrapper" style={{ transform:`scale(${zoom})` }}>
        <div className="phone-frame">
          <div className="phone-notch"><div className="phone-notch-camera"/><div className="phone-notch-speaker"/></div>
          <div className="phone-btn-l1"/><div className="phone-btn-l2"/><div className="phone-btn-l3"/><div className="phone-btn-r1"/>

          <div className="phone-inner" style={{ background:screen.backgroundColor }}>
            <div className="phone-status-bar" style={{ background:screen.backgroundColor, color:statusColor }}>
              <span style={{ fontSize:11, fontWeight:700, fontFamily:'system-ui' }}>9:41</span>
              <span style={{ fontSize:10, fontFamily:'system-ui' }}>▶▶ ▌▌▌</span>
            </div>

            <div
              ref={phoneRef}
              className={`phone-content${isDragOver?' drop-active':''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {elements.length === 0 ? (
                <div className="canvas-drop-hint">
                  <div className="canvas-drop-hint-icon"><Cpu size={40} strokeWidth={1}/></div>
                  <div style={{ fontWeight:600, marginBottom:4 }}>Linha de Montagem vazia</div>
                  <div style={{ fontSize:12 }}>Arraste componentes do Estoque · Reordene arrastando os elementos</div>
                </div>
              ) : (
                elements.map((el, idx) => (
                  <CanvasEl
                    key={el.id}
                    el={el}
                    isSelected={selectedId===el.id}
                    onClick={() => selectElement(el.id)}
                    onDelete={() => deleteElement(el.id)}
                    onMoveUp={() => moveUp(idx)}
                    onMoveDown={() => moveDown(idx)}
                    isFirst={idx===0}
                    isLast={idx===elements.length-1}
                    onDragStartEl={() => handleElDragStart(idx)}
                    onDragOverEl={() => handleElDragOver(idx)}
                    onDropEl={() => handleElDrop(idx)}
                    isDragTarget={dropIndex===idx && dragIndex!==idx}
                  />
                ))
              )}
            </div>

            <div className="phone-home-bar">
              <div className="phone-home-bar-indicator" style={{ background:`${statusColor}40` }}/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
