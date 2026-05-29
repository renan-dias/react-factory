import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const generateId = () => Math.random().toString(36).substr(2, 9);

export const COMPONENT_DEFS = {
  Text:         { label: 'Texto',        category: 'básico',    defaultProps: { text: 'Olá Mundo!', fontSize: 16, color: '#000000', fontWeight: 'normal', textAlign: 'left', marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 } },
  Button:       { label: 'Botão',        category: 'básico',    defaultProps: { label: 'Clique Aqui', backgroundColor: '#6366f1', textColor: '#ffffff', fontSize: 16, borderRadius: 10, paddingVertical: 13, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16, action: 'none', targetScreen: '', alertMessage: 'Alerta!' } },
  Image:        { label: 'Imagem',       category: 'mídia',     defaultProps: { source: 'https://picsum.photos/375/200', height: 200, resizeMode: 'cover', marginTop: 0, marginBottom: 8 } },
  Input:        { label: 'Campo Texto',  category: 'formulário',defaultProps: { placeholder: 'Digite aqui...', fontSize: 14, borderColor: '#cccccc', backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 14, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16, variableName: 'inputValue' } },
  View:         { label: 'Container',    category: 'layout',    defaultProps: { backgroundColor: '#f0f4ff', height: 80, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16, borderRadius: 10, padding: 16, label: 'Container' } },
  Card:         { label: 'Card',         category: 'layout',    defaultProps: { title: 'Título do Card', description: 'Descrição do card. Adicione seu conteúdo aqui.', backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16, shadowOpacity: 0.1 } },
  Switch:       { label: 'Switch',       category: 'formulário',defaultProps: { label: 'Ativar opção', trackColor: '#6366f1', marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16, variableName: 'switchValue' } },
  Slider:       { label: 'Slider',       category: 'formulário',defaultProps: { minimumValue: 0, maximumValue: 100, value: 50, minimumTrackTintColor: '#6366f1', marginTop: 12, marginBottom: 12, marginLeft: 16, marginRight: 16, variableName: 'sliderValue' } },
  Icon:         { label: 'Ícone',        category: 'mídia',     defaultProps: { name: 'star', library: 'AntDesign', size: 32, color: '#f59e0b', marginTop: 8, marginBottom: 8, marginLeft: 16 } },
  Divider:      { label: 'Divisor',      category: 'layout',    defaultProps: { color: '#e2e8f0', thickness: 1, marginTop: 12, marginBottom: 12, marginLeft: 16, marginRight: 16 } },
  SafeAreaView: { label: 'Header',       category: 'layout',    defaultProps: { backgroundColor: '#6366f1', paddingVertical: 16, title: 'Minha Tela' } },
};

export const TEMPLATES = [
  {
    id: 'login', name: 'Login', description: 'Autenticação com email e senha', color: '#6366f1',
    preview: ['#6366f1', '#f0f4ff', '#6366f1', '#6366f1'],
    screen: {
      backgroundColor: '#ffffff',
      elements: [
        { type: 'SafeAreaView', props: { backgroundColor: '#6366f1', paddingVertical: 36, title: '' } },
        { type: 'Text', props: { text: 'Bem-vindo de volta!', fontSize: 26, color: '#0f172a', fontWeight: 'bold', textAlign: 'center', marginTop: 32, marginBottom: 6, marginLeft: 24, marginRight: 24 } },
        { type: 'Text', props: { text: 'Entre com suas credenciais para continuar.', fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 0, marginBottom: 32, marginLeft: 24, marginRight: 24 } },
        { type: 'Input', props: { placeholder: 'Email', variableName: 'email', borderColor: '#e2e8f0', borderRadius: 12, fontSize: 14, paddingHorizontal: 16, marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 10, backgroundColor: '#f8faff' } },
        { type: 'Input', props: { placeholder: 'Senha', variableName: 'password', borderColor: '#e2e8f0', borderRadius: 12, fontSize: 14, paddingHorizontal: 16, marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 24, backgroundColor: '#f8faff' } },
        { type: 'Button', props: { label: 'Entrar', backgroundColor: '#6366f1', textColor: '#ffffff', fontSize: 16, borderRadius: 12, paddingVertical: 15, marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 12, action: 'none' } },
        { type: 'Divider', props: { color: '#f1f5f9', thickness: 1, marginTop: 8, marginBottom: 8, marginLeft: 24, marginRight: 24 } },
        { type: 'Button', props: { label: 'Criar conta gratuita', backgroundColor: 'transparent', textColor: '#6366f1', fontSize: 14, borderRadius: 12, paddingVertical: 10, marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 0, action: 'none' } },
      ],
    },
  },
  {
    id: 'home', name: 'Home Feed', description: 'Feed com busca e cards de conteúdo', color: '#0ea5e9',
    preview: ['#0ea5e9', '#f0f4ff', '#ffffff', '#ffffff'],
    screen: {
      backgroundColor: '#f8faff',
      elements: [
        { type: 'SafeAreaView', props: { backgroundColor: '#0ea5e9', paddingVertical: 16, title: 'Início' } },
        { type: 'Input', props: { placeholder: 'Buscar conteúdo...', variableName: 'search', borderColor: '#e2e8f0', borderRadius: 22, fontSize: 14, paddingHorizontal: 20, marginLeft: 16, marginRight: 16, marginTop: 12, marginBottom: 12, backgroundColor: '#ffffff' } },
        { type: 'Text', props: { text: 'Em destaque', fontSize: 18, color: '#0f172a', fontWeight: 'bold', textAlign: 'left', marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 } },
        { type: 'Card', props: { title: 'Novidade do dia', description: 'Confira as últimas atualizações e melhorias do aplicativo.', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginTop: 0, marginBottom: 10, marginLeft: 16, marginRight: 16, shadowOpacity: 0.07 } },
        { type: 'Card', props: { title: 'Dica útil', description: 'Explore todas as funcionalidades disponíveis para você.', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginTop: 0, marginBottom: 10, marginLeft: 16, marginRight: 16, shadowOpacity: 0.07 } },
        { type: 'Text', props: { text: 'Categorias', fontSize: 18, color: '#0f172a', fontWeight: 'bold', textAlign: 'left', marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 } },
        { type: 'Card', props: { title: 'Tecnologia', description: 'Tutoriais e artigos sobre desenvolvimento mobile.', backgroundColor: '#eff6ff', borderRadius: 16, padding: 16, marginTop: 0, marginBottom: 8, marginLeft: 16, marginRight: 16, shadowOpacity: 0.03 } },
      ],
    },
  },
  {
    id: 'profile', name: 'Perfil', description: 'Perfil do usuário com estatísticas', color: '#8b5cf6',
    preview: ['#8b5cf6', '#ddd', '#f0f4ff', '#8b5cf6'],
    screen: {
      backgroundColor: '#ffffff',
      elements: [
        { type: 'SafeAreaView', props: { backgroundColor: '#8b5cf6', paddingVertical: 18, title: 'Meu Perfil' } },
        { type: 'Image', props: { source: 'https://picsum.photos/375/180?random=5', height: 160, resizeMode: 'cover', marginTop: 0, marginBottom: 0 } },
        { type: 'Text', props: { text: 'João Silva', fontSize: 22, color: '#0f172a', fontWeight: 'bold', textAlign: 'center', marginTop: 16, marginBottom: 4, marginLeft: 24, marginRight: 24 } },
        { type: 'Text', props: { text: 'Desenvolvedor Mobile · Expo & React Native', fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 0, marginBottom: 16, marginLeft: 24, marginRight: 24 } },
        { type: 'View', props: { backgroundColor: '#f8faff', height: 72, marginTop: 0, marginBottom: 16, marginLeft: 16, marginRight: 16, borderRadius: 14, padding: 12, label: 'Stats: Posts · Seguidores · Seguindo' } },
        { type: 'Button', props: { label: 'Editar Perfil', backgroundColor: '#8b5cf6', textColor: '#ffffff', fontSize: 15, borderRadius: 12, paddingVertical: 13, marginLeft: 24, marginRight: 24, marginTop: 0, marginBottom: 16, action: 'none' } },
        { type: 'Divider', props: { color: '#f1f5f9', thickness: 1, marginTop: 0, marginBottom: 12, marginLeft: 16, marginRight: 16 } },
        { type: 'Text', props: { text: 'Publicações recentes', fontSize: 16, color: '#0f172a', fontWeight: 'bold', textAlign: 'left', marginTop: 0, marginBottom: 8, marginLeft: 16, marginRight: 16 } },
      ],
    },
  },
  {
    id: 'onboarding', name: 'Onboarding', description: 'Tela de boas-vindas do aplicativo', color: '#10b981',
    preview: ['#e0f2fe', '#10b981', '#10b981'],
    screen: {
      backgroundColor: '#ffffff',
      elements: [
        { type: 'Image', props: { source: 'https://picsum.photos/375/300?random=10', height: 300, resizeMode: 'cover', marginTop: 0, marginBottom: 0 } },
        { type: 'Text', props: { text: 'Bem-vindo ao App!', fontSize: 28, color: '#0f172a', fontWeight: 'bold', textAlign: 'center', marginTop: 32, marginBottom: 12, marginLeft: 32, marginRight: 32 } },
        { type: 'Text', props: { text: 'Descubra uma nova forma de se organizar, conectar e evoluir todos os dias.', fontSize: 15, color: '#64748b', textAlign: 'center', marginTop: 0, marginBottom: 36, marginLeft: 32, marginRight: 32 } },
        { type: 'Button', props: { label: 'Começar agora', backgroundColor: '#10b981', textColor: '#ffffff', fontSize: 16, borderRadius: 50, paddingVertical: 16, marginLeft: 32, marginRight: 32, marginTop: 0, marginBottom: 12, action: 'none' } },
        { type: 'Button', props: { label: 'Já tenho conta', backgroundColor: 'transparent', textColor: '#10b981', fontSize: 14, borderRadius: 50, paddingVertical: 10, marginLeft: 32, marginRight: 32, marginTop: 0, marginBottom: 0, action: 'none' } },
      ],
    },
  },
  {
    id: 'dashboard', name: 'Dashboard', description: 'Painel de métricas e acesso rápido', color: '#f59e0b',
    preview: ['#1e293b', '#1e293b', '#1e293b', '#f59e0b'],
    screen: {
      backgroundColor: '#0f172a',
      elements: [
        { type: 'SafeAreaView', props: { backgroundColor: '#1e293b', paddingVertical: 16, title: 'Dashboard' } },
        { type: 'Text', props: { text: 'Olá, João!', fontSize: 24, color: '#f8fafc', fontWeight: 'bold', textAlign: 'left', marginTop: 20, marginBottom: 4, marginLeft: 20, marginRight: 20 } },
        { type: 'Text', props: { text: 'Aqui está o resumo de hoje', fontSize: 13, color: '#94a3b8', textAlign: 'left', marginTop: 0, marginBottom: 20, marginLeft: 20, marginRight: 20 } },
        { type: 'Card', props: { title: 'R$ 12.430,00', description: 'Receita do mês · +18% em relação ao mês anterior', backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginTop: 0, marginBottom: 10, marginLeft: 16, marginRight: 16, shadowOpacity: 0.25 } },
        { type: 'Card', props: { title: '1.248 usuários', description: 'Total ativos · +32 novos cadastros hoje', backgroundColor: '#1e293b', borderRadius: 16, padding: 20, marginTop: 0, marginBottom: 10, marginLeft: 16, marginRight: 16, shadowOpacity: 0.25 } },
        { type: 'Text', props: { text: 'Acesso rápido', fontSize: 16, color: '#f8fafc', fontWeight: 'bold', textAlign: 'left', marginTop: 12, marginBottom: 10, marginLeft: 20, marginRight: 20 } },
        { type: 'Button', props: { label: 'Ver relatório completo', backgroundColor: '#f59e0b', textColor: '#0f172a', fontSize: 15, borderRadius: 12, paddingVertical: 14, marginLeft: 16, marginRight: 16, marginTop: 0, marginBottom: 8, action: 'none' } },
      ],
    },
  },
  {
    id: 'settings', name: 'Configurações', description: 'Tela de configurações e preferências', color: '#64748b',
    preview: ['#334155', '#ffffff', '#f8faff', '#f8faff'],
    screen: {
      backgroundColor: '#f8faff',
      elements: [
        { type: 'SafeAreaView', props: { backgroundColor: '#334155', paddingVertical: 16, title: 'Configurações' } },
        { type: 'Card', props: { title: 'João Silva', description: 'joao.silva@email.com · Conta Premium', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginTop: 16, marginBottom: 16, marginLeft: 16, marginRight: 16, shadowOpacity: 0.06 } },
        { type: 'Text', props: { text: 'PREFERÊNCIAS', fontSize: 10, color: '#94a3b8', fontWeight: 'bold', textAlign: 'left', marginTop: 4, marginBottom: 8, marginLeft: 20, marginRight: 20 } },
        { type: 'Switch', props: { label: 'Modo Escuro', trackColor: '#6366f1', marginTop: 4, marginBottom: 4, marginLeft: 16, marginRight: 16, variableName: 'darkMode' } },
        { type: 'Switch', props: { label: 'Notificações push', trackColor: '#6366f1', marginTop: 4, marginBottom: 4, marginLeft: 16, marginRight: 16, variableName: 'notifications' } },
        { type: 'Switch', props: { label: 'Sincronização automática', trackColor: '#6366f1', marginTop: 4, marginBottom: 8, marginLeft: 16, marginRight: 16, variableName: 'autoSync' } },
        { type: 'Divider', props: { color: '#e2e8f0', thickness: 1, marginTop: 8, marginBottom: 8, marginLeft: 16, marginRight: 16 } },
        { type: 'Button', props: { label: 'Sair da conta', backgroundColor: 'transparent', textColor: '#ef4444', fontSize: 15, borderRadius: 10, paddingVertical: 12, marginLeft: 16, marginRight: 16, marginTop: 0, marginBottom: 0, action: 'none' } },
      ],
    },
  },
];

const makeScreen = (name) => ({ id: generateId(), name, backgroundColor: '#f5f5f5', elements: [], blocks: [] });

const makeInitialProject = () => {
  const home = makeScreen('Home');
  return { name: 'Meu App', screens: [home], currentScreenId: home.id, selectedElementId: null };
};

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

  const addScreen = () => {
    const s = makeScreen(`Tela ${project.screens.length + 1}`);
    setProject(p => ({ ...p, screens: [...p.screens, s], currentScreenId: s.id, selectedElementId: null }));
  };

  const deleteScreen = (id) => {
    if (project.screens.length <= 1) return;
    setProject(p => {
      const screens = p.screens.filter(s => s.id !== id);
      return { ...p, screens, currentScreenId: p.currentScreenId === id ? screens[0].id : p.currentScreenId };
    });
  };

  const applyTemplate = (template) => {
    const newScreen = {
      id: generateId(),
      name: template.name,
      backgroundColor: template.screen.backgroundColor,
      elements: template.screen.elements.map(el => ({ ...el, id: generateId(), props: { ...el.props } })),
      blocks: [],
    };
    setProject(p => ({ ...p, screens: [...p.screens, newScreen], currentScreenId: newScreen.id, selectedElementId: null }));
  };

  const switchScreen = (id) => setProject(p => ({ ...p, currentScreenId: id, selectedElementId: null }));
  const renameScreen = (id, name) => setProject(p => ({ ...p, screens: p.screens.map(s => s.id === id ? { ...s, name } : s) }));
  const updateScreenProp = (prop, value) => setProject(p => ({ ...p, screens: p.screens.map(s => s.id === p.currentScreenId ? { ...s, [prop]: value } : s) }));

  const addElement = (type) => {
    const el = { id: generateId(), type, props: { ...COMPONENT_DEFS[type].defaultProps } };
    setProject(p => ({
      ...p,
      screens: p.screens.map(s => s.id !== p.currentScreenId ? s : { ...s, elements: [...s.elements, el] }),
      selectedElementId: el.id,
    }));
  };

  const deleteElement = (id) => setProject(p => ({
    ...p,
    screens: p.screens.map(s => s.id !== p.currentScreenId ? s : { ...s, elements: s.elements.filter(e => e.id !== id) }),
    selectedElementId: p.selectedElementId === id ? null : p.selectedElementId,
  }));

  const selectElement = (id) => setProject(p => ({ ...p, selectedElementId: id }));

  const updateElement = (id, props) => setProject(p => ({
    ...p,
    screens: p.screens.map(s => s.id !== p.currentScreenId ? s : {
      ...s, elements: s.elements.map(e => e.id === id ? { ...e, props: { ...e.props, ...props } } : e),
    }),
  }));

  const reorderElements = (newElements) => setProject(p => ({
    ...p, screens: p.screens.map(s => s.id === p.currentScreenId ? { ...s, elements: newElements } : s),
  }));

  const addBlock = (block) => setProject(p => ({
    ...p, screens: p.screens.map(s => s.id !== p.currentScreenId ? s : { ...s, blocks: [...(s.blocks || []), { ...block, id: generateId() }] }),
  }));

  const updateBlock = (blockId, changes) => setProject(p => ({
    ...p, screens: p.screens.map(s => s.id !== p.currentScreenId ? s : { ...s, blocks: s.blocks.map(b => b.id === blockId ? { ...b, ...changes } : b) }),
  }));

  const deleteBlock = (blockId) => setProject(p => ({
    ...p, screens: p.screens.map(s => s.id !== p.currentScreenId ? s : { ...s, blocks: s.blocks.filter(b => b.id !== blockId) }),
  }));

  const setProjectName = (name) => setProject(p => ({ ...p, name }));
  const resetProject = () => setProject(makeInitialProject());

  const exportProject = () => {
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${project.name.replace(/\s/g, '_')}.rfactory`; a.click();
    URL.revokeObjectURL(url);
  };

  const importProject = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => { try { setProject(JSON.parse(e.target.result)); } catch { alert('Arquivo inválido!'); } };
    reader.readAsText(file);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      project, getCurrentScreen,
      addScreen, deleteScreen, switchScreen, renameScreen, updateScreenProp, applyTemplate,
      addElement, deleteElement, selectElement, updateElement, reorderElements,
      addBlock, updateBlock, deleteBlock,
      setProjectName, resetProject, exportProject, importProject,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
