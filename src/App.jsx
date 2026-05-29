import React, { useState } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Header from './components/Header';
import ComponentPalette from './components/ComponentPalette';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import BlockEditor from './components/BlockEditor';
import AppBuild from './components/AppBuild';
import TemplateGallery from './components/TemplateGallery';
import './App.css';

function AppBackground() {
  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-bg-gradient" />
      <div className="app-orb app-orb-1" />
      <div className="app-orb app-orb-2" />
      <div className="app-orb app-orb-3" />
    </div>
  );
}

function Inner() {
  const { theme } = useApp();
  const [showAppBuild, setShowAppBuild]     = useState(false);
  const [showBlocks, setShowBlocks]         = useState(false);
  const [showTemplates, setShowTemplates]   = useState(false);

  return (
    <div className="app" data-theme={theme}>
      <AppBackground />
      <Header
        onAppBuild={() => setShowAppBuild(true)}
        onToggleBlocks={() => setShowBlocks(v => !v)}
        blocksOpen={showBlocks}
      />
      <div className="workspace">
        <ComponentPalette onShowTemplates={() => setShowTemplates(true)} />
        <Canvas />
        <PropertiesPanel />
      </div>
      {showBlocks    && <BlockEditor     onClose={() => setShowBlocks(false)}    />}
      {showAppBuild  && <AppBuild        onClose={() => setShowAppBuild(false)}   />}
      {showTemplates && <TemplateGallery onClose={() => setShowTemplates(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  );
}
