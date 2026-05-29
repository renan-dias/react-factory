import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const generateId = () => Math.random().toString(36).substr(2, 9);

export const COMPONENT_DEFS = {
  // ── BÁSICO ──────────────────────────────────────────────────
  Text:        { label:'Texto',           category:'básico',     defaultProps:{text:'Olá Mundo!',fontSize:16,color:'#000000',fontWeight:'normal',textAlign:'left',marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  Button:      { label:'Botão',           category:'básico',     defaultProps:{label:'Clique Aqui',backgroundColor:'#6366f1',textColor:'#ffffff',fontSize:16,borderRadius:10,paddingVertical:13,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16,action:'none',targetScreen:'',alertMessage:'Alerta!'}},
  // ── LAYOUT ──────────────────────────────────────────────────
  View:        { label:'Container',       category:'layout',     defaultProps:{backgroundColor:'#f0f4ff',height:80,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16,borderRadius:10,padding:16,label:'Container'}},
  Card:        { label:'Card',            category:'layout',     defaultProps:{title:'Título do Card',description:'Descrição do card.',backgroundColor:'#ffffff',borderRadius:14,padding:16,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16,shadowOpacity:.1}},
  SafeAreaView:{ label:'Header',          category:'layout',     defaultProps:{backgroundColor:'#6366f1',paddingVertical:16,title:'Minha Tela'}},
  Divider:     { label:'Divisor',         category:'layout',     defaultProps:{color:'#e2e8f0',thickness:1,marginTop:12,marginBottom:12,marginLeft:16,marginRight:16}},
  FAB:         { label:'Botão Flutuante', category:'layout',     defaultProps:{icon:'plus',backgroundColor:'#6366f1',iconColor:'#ffffff',size:56,bottomOffset:24,rightOffset:24,action:'none',targetScreen:'',alertMessage:''}},
  Avatar:      { label:'Avatar',          category:'layout',     defaultProps:{name:'João Silva',source:'',size:60,backgroundColor:'#6366f1',textColor:'#ffffff',marginTop:8,marginBottom:8,marginLeft:16,borderRadius:999}},
  Badge:       { label:'Badge',           category:'layout',     defaultProps:{text:'3',backgroundColor:'#ef4444',textColor:'#ffffff',fontSize:12,marginTop:8,marginBottom:8,marginLeft:16}},
  ProgressBar: { label:'Barra Progresso', category:'layout',     defaultProps:{progress:.65,color:'#6366f1',trackColor:'#e2e8f0',height:8,borderRadius:4,label:'Carregando...',showLabel:true,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  Chip:        { label:'Chip / Tag',      category:'layout',     defaultProps:{label:'React Native',backgroundColor:'#ede9fe',textColor:'#7c3aed',fontSize:12,borderRadius:20,paddingH:12,paddingV:5,marginTop:8,marginBottom:8,marginLeft:8}},
  // ── FORMULÁRIO ──────────────────────────────────────────────
  Input:       { label:'Campo Texto',     category:'formulário', defaultProps:{placeholder:'Digite aqui...',fontSize:14,borderColor:'#cccccc',backgroundColor:'#ffffff',borderRadius:10,paddingHorizontal:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16,variableName:'inputValue'}},
  Switch:      { label:'Switch',          category:'formulário', defaultProps:{label:'Ativar opção',trackColor:'#6366f1',marginTop:8,marginBottom:8,marginLeft:16,marginRight:16,variableName:'switchValue'}},
  Slider:      { label:'Slider',          category:'formulário', defaultProps:{minimumValue:0,maximumValue:100,value:50,minimumTrackTintColor:'#6366f1',marginTop:12,marginBottom:12,marginLeft:16,marginRight:16,variableName:'sliderValue'}},
  Rating:      { label:'Avaliação ★',     category:'formulário', defaultProps:{defaultRating:3,maxRating:5,size:30,activeColor:'#f59e0b',inactiveColor:'#e2e8f0',marginTop:8,marginBottom:8,marginLeft:16,variableName:'rating'}},
  Checkbox:    { label:'Checkbox',        category:'formulário', defaultProps:{label:'Aceito os termos de uso',checked:false,checkColor:'#6366f1',borderColor:'#6366f1',fontSize:14,marginTop:8,marginBottom:8,marginLeft:16,variableName:'isChecked'}},
  // ── MÍDIA ───────────────────────────────────────────────────
  Image:       { label:'Imagem',          category:'mídia',      defaultProps:{source:'https://picsum.photos/375/200',height:200,resizeMode:'cover',marginTop:0,marginBottom:8}},
  Icon:        { label:'Ícone',           category:'mídia',      defaultProps:{name:'star',library:'AntDesign',size:32,color:'#f59e0b',marginTop:8,marginBottom:8,marginLeft:16}},
  Sound:       { label:'Player de Som',   category:'mídia',      defaultProps:{title:'Faixa de Áudio',artist:'Artista',sourceUrl:'https://www.soundjay.com/misc/sounds/bell-ringing-01.mp3',accentColor:'#6366f1',backgroundColor:'#1e293b',textColor:'#ffffff',marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  Video:       { label:'Player de Vídeo', category:'mídia',      defaultProps:{sourceUrl:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',height:220,marginTop:0,marginBottom:8}},
  // ── CÂMERA & GPS ────────────────────────────────────────────
  Camera:      { label:'Câmera',          category:'câmera',     defaultProps:{height:300,facing:'back',showCaptureButton:true,marginTop:0,marginBottom:8,variableName:'photoUri'}},
  MapView:     { label:'Mapa (GPS)',       category:'localização',defaultProps:{height:300,latitude:-23.5505,longitude:-46.6333,latitudeDelta:.05,longitudeDelta:.05,showsUserLocation:true,markerTitle:'Localização',marginTop:0,marginBottom:8}},
  // ── APIS EXTERNAS ────────────────────────────────────────────
  WeatherWidget:{ label:'Clima',          category:'api',        apiProvider:'Open-Meteo',apiKey:false,apiDocs:'https://open-meteo.com',
    defaultProps:{city:'São Paulo',latitude:-23.5505,longitude:-46.6333,backgroundColor:'#0ea5e9',textColor:'#ffffff',borderRadius:16,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  CryptoPrice: { label:'Cripto Preço',    category:'api',        apiProvider:'CoinGecko',apiKey:false,apiDocs:'https://docs.coingecko.com',
    defaultProps:{coinId:'bitcoin',coinName:'Bitcoin',backgroundColor:'#f59e0b',textColor:'#ffffff',borderRadius:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  PokeCard:    { label:'PokéCard',        category:'api',        apiProvider:'PokéAPI',apiKey:false,apiDocs:'https://pokeapi.co',
    defaultProps:{pokemonId:1,pokemonName:'bulbasaur',backgroundColor:'#4ade80',textColor:'#ffffff',borderRadius:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  CountryCard: { label:'Info País',       category:'api',        apiProvider:'RestCountries',apiKey:false,apiDocs:'https://restcountries.com',
    defaultProps:{country:'Brazil',backgroundColor:'#ffffff',borderRadius:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  JokeCard:    { label:'Piada Aleatória', category:'api',        apiProvider:'JokeAPI',apiKey:false,apiDocs:'https://v2.jokeapi.dev',
    defaultProps:{category:'Programming',buttonLabel:'Nova piada',backgroundColor:'#fef3c7',textColor:'#92400e',borderRadius:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  RandomUser:  { label:'Usuário Aleatório',category:'api',       apiProvider:'RandomUser.me',apiKey:false,apiDocs:'https://randomuser.me',
    defaultProps:{gender:'any',backgroundColor:'#ffffff',borderRadius:14,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
  NewsFeed:    { label:'Feed de Notícias',category:'api',        apiProvider:'NewsAPI',apiKey:true,apiDocs:'https://newsapi.org',
    defaultProps:{query:'tecnologia',apiKey:'SUA_API_KEY',pageSize:3,backgroundColor:'#ffffff',borderRadius:14,marginTop:8,marginBottom:8}},
  MovieCard:   { label:'Card de Filme',   category:'api',        apiProvider:'TMDB',apiKey:true,apiDocs:'https://www.themoviedb.org/documentation/api',
    defaultProps:{movieId:'299536',apiKey:'SUA_API_KEY',backgroundColor:'#1e293b',borderRadius:14,height:200,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
};

export const TEMPLATES = [
  { id:'login',     name:'Login',          description:'Autenticação com email e senha',      color:'#6366f1', preview:['#6366f1','#f0f4ff','#6366f1','#6366f1'],
    screen:{backgroundColor:'#ffffff',elements:[
      {type:'SafeAreaView',props:{backgroundColor:'#6366f1',paddingVertical:36,title:''}},
      {type:'Text',props:{text:'Bem-vindo de volta!',fontSize:26,color:'#0f172a',fontWeight:'bold',textAlign:'center',marginTop:32,marginBottom:6,marginLeft:24,marginRight:24}},
      {type:'Text',props:{text:'Entre com suas credenciais para continuar.',fontSize:14,color:'#64748b',textAlign:'center',marginTop:0,marginBottom:28,marginLeft:24,marginRight:24}},
      {type:'Input',props:{placeholder:'Email',variableName:'email',borderColor:'#e2e8f0',borderRadius:12,fontSize:14,paddingHorizontal:16,marginLeft:24,marginRight:24,marginTop:0,marginBottom:10,backgroundColor:'#f8faff'}},
      {type:'Input',props:{placeholder:'Senha',variableName:'password',borderColor:'#e2e8f0',borderRadius:12,fontSize:14,paddingHorizontal:16,marginLeft:24,marginRight:24,marginTop:0,marginBottom:24,backgroundColor:'#f8faff'}},
      {type:'Button',props:{label:'Entrar',backgroundColor:'#6366f1',textColor:'#ffffff',fontSize:16,borderRadius:12,paddingVertical:15,marginLeft:24,marginRight:24,marginTop:0,marginBottom:12,action:'none'}},
      {type:'Divider',props:{color:'#f1f5f9',thickness:1,marginTop:8,marginBottom:8,marginLeft:24,marginRight:24}},
      {type:'Button',props:{label:'Criar conta gratuita',backgroundColor:'transparent',textColor:'#6366f1',fontSize:14,borderRadius:12,paddingVertical:10,marginLeft:24,marginRight:24,marginTop:0,marginBottom:0,action:'none'}},
    ]}},
  { id:'home',      name:'Home Feed',       description:'Feed com busca e cards de conteúdo',   color:'#0ea5e9', preview:['#0ea5e9','#f0f4ff','#ffffff','#ffffff'],
    screen:{backgroundColor:'#f8faff',elements:[
      {type:'SafeAreaView',props:{backgroundColor:'#0ea5e9',paddingVertical:16,title:'Início'}},
      {type:'Input',props:{placeholder:'Buscar conteúdo...',variableName:'search',borderColor:'#e2e8f0',borderRadius:22,fontSize:14,paddingHorizontal:20,marginLeft:16,marginRight:16,marginTop:12,marginBottom:12,backgroundColor:'#ffffff'}},
      {type:'Text',props:{text:'Em destaque',fontSize:18,color:'#0f172a',fontWeight:'bold',textAlign:'left',marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
      {type:'Card',props:{title:'Novidade do dia',description:'Confira as últimas atualizações do aplicativo.',backgroundColor:'#ffffff',borderRadius:16,padding:16,marginTop:0,marginBottom:10,marginLeft:16,marginRight:16,shadowOpacity:.07}},
      {type:'Card',props:{title:'Dica útil',description:'Explore todas as funcionalidades disponíveis.',backgroundColor:'#ffffff',borderRadius:16,padding:16,marginTop:0,marginBottom:10,marginLeft:16,marginRight:16,shadowOpacity:.07}},
    ]}},
  { id:'profile',   name:'Perfil',          description:'Perfil do usuário com estatísticas',   color:'#8b5cf6', preview:['#8b5cf6','#ddd','#f0f4ff','#8b5cf6'],
    screen:{backgroundColor:'#ffffff',elements:[
      {type:'SafeAreaView',props:{backgroundColor:'#8b5cf6',paddingVertical:18,title:'Meu Perfil'}},
      {type:'Image',props:{source:'https://picsum.photos/375/180?random=5',height:160,resizeMode:'cover',marginTop:0,marginBottom:0}},
      {type:'Text',props:{text:'João Silva',fontSize:22,color:'#0f172a',fontWeight:'bold',textAlign:'center',marginTop:16,marginBottom:4,marginLeft:24,marginRight:24}},
      {type:'Text',props:{text:'Desenvolvedor Mobile · Expo & React Native',fontSize:13,color:'#64748b',textAlign:'center',marginTop:0,marginBottom:16,marginLeft:24,marginRight:24}},
      {type:'View',props:{backgroundColor:'#f8faff',height:72,marginTop:0,marginBottom:16,marginLeft:16,marginRight:16,borderRadius:14,padding:12,label:'Posts · Seguidores · Seguindo'}},
      {type:'Button',props:{label:'Editar Perfil',backgroundColor:'#8b5cf6',textColor:'#ffffff',fontSize:15,borderRadius:12,paddingVertical:13,marginLeft:24,marginRight:24,marginTop:0,marginBottom:16,action:'none'}},
    ]}},
  { id:'onboarding',name:'Onboarding',       description:'Tela de boas-vindas do aplicativo',    color:'#10b981', preview:['#e0f2fe','#10b981','#10b981'],
    screen:{backgroundColor:'#ffffff',elements:[
      {type:'Image',props:{source:'https://picsum.photos/375/300?random=10',height:300,resizeMode:'cover',marginTop:0,marginBottom:0}},
      {type:'Text',props:{text:'Bem-vindo ao App!',fontSize:28,color:'#0f172a',fontWeight:'bold',textAlign:'center',marginTop:32,marginBottom:12,marginLeft:32,marginRight:32}},
      {type:'Text',props:{text:'Descubra uma nova forma de se organizar e evoluir todos os dias.',fontSize:15,color:'#64748b',textAlign:'center',marginTop:0,marginBottom:36,marginLeft:32,marginRight:32}},
      {type:'Button',props:{label:'Começar agora',backgroundColor:'#10b981',textColor:'#ffffff',fontSize:16,borderRadius:50,paddingVertical:16,marginLeft:32,marginRight:32,marginTop:0,marginBottom:12,action:'none'}},
    ]}},
  { id:'dashboard',name:'Dashboard',         description:'Painel de métricas e acesso rápido',  color:'#f59e0b', preview:['#1e293b','#1e293b','#1e293b','#f59e0b'],
    screen:{backgroundColor:'#0f172a',elements:[
      {type:'SafeAreaView',props:{backgroundColor:'#1e293b',paddingVertical:16,title:'Dashboard'}},
      {type:'Text',props:{text:'Olá, João!',fontSize:24,color:'#f8fafc',fontWeight:'bold',textAlign:'left',marginTop:20,marginBottom:4,marginLeft:20,marginRight:20}},
      {type:'Card',props:{title:'R$ 12.430,00',description:'Receita do mês · +18% vs mês anterior',backgroundColor:'#1e293b',borderRadius:16,padding:20,marginTop:0,marginBottom:10,marginLeft:16,marginRight:16,shadowOpacity:.25}},
      {type:'ProgressBar',props:{progress:.78,color:'#f59e0b',trackColor:'rgba(255,255,255,0.1)',height:6,borderRadius:3,label:'Meta mensal: 78%',showLabel:true,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
      {type:'Button',props:{label:'Ver relatório completo',backgroundColor:'#f59e0b',textColor:'#0f172a',fontSize:15,borderRadius:12,paddingVertical:14,marginLeft:16,marginRight:16,marginTop:8,marginBottom:8,action:'none'}},
    ]}},
  { id:'settings',name:'Configurações',       description:'Tela de configurações e preferências', color:'#64748b', preview:['#334155','#ffffff','#f8faff','#f8faff'],
    screen:{backgroundColor:'#f8faff',elements:[
      {type:'SafeAreaView',props:{backgroundColor:'#334155',paddingVertical:16,title:'Configurações'}},
      {type:'Avatar',props:{name:'João Silva',source:'',size:64,backgroundColor:'#6366f1',textColor:'#ffffff',marginTop:20,marginBottom:8,marginLeft:16,borderRadius:999}},
      {type:'Text',props:{text:'João Silva',fontSize:16,color:'#0f172a',fontWeight:'bold',textAlign:'left',marginTop:0,marginBottom:16,marginLeft:16,marginRight:16}},
      {type:'Switch',props:{label:'Modo Escuro',trackColor:'#6366f1',marginTop:4,marginBottom:4,marginLeft:16,marginRight:16,variableName:'darkMode'}},
      {type:'Switch',props:{label:'Notificações push',trackColor:'#6366f1',marginTop:4,marginBottom:4,marginLeft:16,marginRight:16,variableName:'notifications'}},
      {type:'Divider',props:{color:'#e2e8f0',thickness:1,marginTop:8,marginBottom:8,marginLeft:16,marginRight:16}},
      {type:'Button',props:{label:'Sair da conta',backgroundColor:'transparent',textColor:'#ef4444',fontSize:15,borderRadius:10,paddingVertical:12,marginLeft:16,marginRight:16,marginTop:0,marginBottom:0,action:'none'}},
    ]}},
];

const makeScreen = (name) => ({ id: generateId(), name, backgroundColor: '#f5f5f5', elements: [], blocks: [] });
const makeInitialProject = () => { const h = makeScreen('Home'); return { name:'Meu App', screens:[h], currentScreenId:h.id, selectedElementId:null }; };

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('rf_theme') || 'dark');
  const [project, setProject] = useState(() => {
    try { const s = localStorage.getItem('rf_project'); if (s) return JSON.parse(s); } catch {}
    return makeInitialProject();
  });

  useEffect(() => { localStorage.setItem('rf_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('rf_project', JSON.stringify(project)); }, [project]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const getCurrentScreen = () => project.screens.find(s => s.id === project.currentScreenId) || project.screens[0];
  const addScreen = () => { const s = makeScreen(`Tela ${project.screens.length+1}`); setProject(p => ({...p,screens:[...p.screens,s],currentScreenId:s.id,selectedElementId:null})); };
  const deleteScreen = (id) => { if(project.screens.length<=1) return; setProject(p => { const sc=p.screens.filter(s=>s.id!==id); return {...p,screens:sc,currentScreenId:p.currentScreenId===id?sc[0].id:p.currentScreenId}; }); };
  const applyTemplate = (tpl) => { const s={id:generateId(),name:tpl.name,backgroundColor:tpl.screen.backgroundColor,elements:tpl.screen.elements.map(el=>({...el,id:generateId(),props:{...el.props}})),blocks:[]}; setProject(p=>({...p,screens:[...p.screens,s],currentScreenId:s.id,selectedElementId:null})); };
  const switchScreen = (id) => setProject(p => ({...p,currentScreenId:id,selectedElementId:null}));
  const renameScreen = (id, name) => setProject(p => ({...p,screens:p.screens.map(s=>s.id===id?{...s,name}:s)}));
  const updateScreenProp = (prop, value) => setProject(p => ({...p,screens:p.screens.map(s=>s.id===p.currentScreenId?{...s,[prop]:value}:s)}));
  const addElement = (type) => { const el={id:generateId(),type,props:{...COMPONENT_DEFS[type].defaultProps}}; setProject(p=>({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,elements:[...s.elements,el]}),selectedElementId:el.id})); };
  const deleteElement = (id) => setProject(p => ({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,elements:s.elements.filter(e=>e.id!==id)}),selectedElementId:p.selectedElementId===id?null:p.selectedElementId}));
  const selectElement = (id) => setProject(p => ({...p,selectedElementId:id}));
  const updateElement = (id, props) => setProject(p => ({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,elements:s.elements.map(e=>e.id===id?{...e,props:{...e.props,...props}}:e)})}));
  const reorderElements = (newEls) => setProject(p => ({...p,screens:p.screens.map(s=>s.id===p.currentScreenId?{...s,elements:newEls}:s)}));
  const addBlock = (block) => setProject(p => ({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,blocks:[...(s.blocks||[]),{...block,id:generateId()}]})}));
  const updateBlock = (bid, ch) => setProject(p => ({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,blocks:s.blocks.map(b=>b.id===bid?{...b,...ch}:b)})}));
  const deleteBlock = (bid) => setProject(p => ({...p,screens:p.screens.map(s=>s.id!==p.currentScreenId?s:{...s,blocks:s.blocks.filter(b=>b.id!==bid)})}));
  const setProjectName = (name) => setProject(p => ({...p,name}));
  const resetProject = () => setProject(makeInitialProject());
  const exportProject = () => { const b=new Blob([JSON.stringify(project,null,2)],{type:'application/json'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download=`${project.name.replace(/\s/g,'_')}.rfactory`; a.click(); URL.revokeObjectURL(u); };
  const importProject = (file) => { const r=new FileReader(); r.onload=e=>{ try{setProject(JSON.parse(e.target.result))}catch{alert('Arquivo inválido!')} }; r.readAsText(file); };

  return (
    <AppContext.Provider value={{
      theme,toggleTheme,project,getCurrentScreen,
      addScreen,deleteScreen,switchScreen,renameScreen,updateScreenProp,applyTemplate,
      addElement,deleteElement,selectElement,updateElement,reorderElements,
      addBlock,updateBlock,deleteBlock,
      setProjectName,resetProject,exportProject,importProject,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
