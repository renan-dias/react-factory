import React, { useRef } from 'react';
import { Hammer, Sun, Moon, Save, FolderOpen, Trash2, Puzzle, Rocket, Cpu, Layout, Maximize2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

function showToast(message) {
  const prev = document.querySelector('.toast');
  if (prev) prev.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el?.remove(), 2200);
}

export default function Header({ onAppBuild, onToggleBlocks, blocksOpen }) {
  const { theme, toggleTheme, project, setProjectName, exportProject, importProject, resetProject, creationMode, toggleCreationMode } = useApp();
  const importRef = useRef();

  const handleSave = () => { exportProject(); showToast('Projeto exportado com sucesso!'); };
  const handleImport = (e) => { if (e.target.files[0]) { importProject(e.target.files[0]); showToast('Projeto importado!'); } };
  const handleReset = () => { if (confirm('Resetar projeto? Todos os dados serão perdidos.')) resetProject(); };
  const handleModeToggle = () => {
    toggleCreationMode();
    showToast(creationMode === 'normal' ? 'Modo Avançado ativado — arraste e redimensione' : 'Modo Normal ativado');
  };

  return (
    <header className="header">
      <div className="header-logo">
        <div className="header-logo-icon">
          <Hammer size={16} />
        </div>
        <span className="header-logo-name">React Factory</span>
        <span className="header-logo-badge">EXPO</span>
      </div>

      <div className="header-sep" />

      <input
        className="header-project-name"
        value={project.name}
        onChange={e => setProjectName(e.target.value)}
        title="Nome do projeto"
      />

      <div className="header-spacer" />

      <div className="header-actions">
        <button
          className={`btn btn-sm ${creationMode === 'normal' ? 'btn-mode-normal' : 'btn-mode-adv'}`}
          onClick={handleModeToggle}
          title={creationMode === 'normal' ? 'Ativar Modo Avançado (arrastar/redimensionar)' : 'Voltar ao Modo Normal'}
        >
          {creationMode === 'normal' ? <Layout size={13}/> : <Maximize2 size={13}/>}
          {creationMode === 'normal' ? 'Normal' : 'Avançado'}
        </button>

        <div className="header-sep" />

        <button
          className={`btn btn-sm${blocksOpen ? ' btn-primary' : ' btn-ghost'}`}
          onClick={onToggleBlocks}
          title="Linha de Lógica — Programação por Blocos"
        >
          <Puzzle size={13} />
          Blocos
        </button>

        <div className="header-sep" />

        <button className="btn btn-ghost btn-icon" onClick={toggleTheme} title={`Alternar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}>
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button className="btn btn-sm" onClick={handleSave} title="Exportar projeto (.rfactory)">
          <Save size={13} />
          Salvar
        </button>

        <button className="btn btn-sm" onClick={() => importRef.current.click()} title="Importar projeto">
          <FolderOpen size={13} />
          Abrir
        </button>

        <button className="btn btn-danger btn-icon btn-sm" onClick={handleReset} title="Resetar projeto">
          <Trash2 size={13} />
        </button>

        <div className="header-sep" />

        <button className="btn btn-accent btn-sm" onClick={onAppBuild} title="Gerar Blueprint — Tutorial passo a passo para Expo">
          <Rocket size={13} />
          AppBuild
        </button>

        <input ref={importRef} type="file" accept=".rfactory,.json" style={{ display: 'none' }} onChange={handleImport} />
      </div>
    </header>
  );
}
