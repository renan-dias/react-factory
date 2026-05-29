import React, { useState, useCallback } from 'react';
import { Rocket, X, ChevronLeft, ChevronRight, Copy, Check, BookOpen } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { generateExpoProject } from '../utils/codeGenerator';

const STEP_ICONS = {
  CheckSquare: '✔', Rocket: '▲', FolderOpen: '▶', Package: '⊞',
  Settings: '⚙', Map: '⊙', Smartphone: '▪', Download: '↓',
  Key: '◈', Globe: '◉', Star: '★',
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const highlighted = highlightCode(code, language);

  return (
    <div className="slide-code-area">
      <div className="slide-code-header">
        <span className="slide-lang-badge">{language}</span>
        <button className="btn btn-sm" onClick={handleCopy}>
          {copied ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar código</>}
        </button>
      </div>
      <div
        className="slide-code-block"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  );
}

function highlightCode(code, lang) {
  if (!code) return '';
  // Sanitize HTML characters first
  let s = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  if (lang === 'bash') {
    // Comments (#)
    s = s.replace(/(#[^\n]*)/g, '<span style="color:#6a9955">$1</span>');
    // Strings
    s = s.replace(/((?:&quot;|&#39;)[^&]*(?:&quot;|&#39;))/g, '<span style="color:#ce9178">$1</span>');
    // Commands at start of line
    s = s.replace(/^(npx|npm|node|eas|git|ls|cd|keytool)\b/gm, '<span style="color:#569cd6">$1</span>');
    // Flags
    s = s.replace(/(\s--[\w-]+)/g, '<span style="color:#9cdcfe">$1</span>');
  } else if (lang === 'javascript') {
    // Comments
    s = s.replace(/(\/\/[^\n]*)/g, '<span style="color:#6a9955">$1</span>');
    // Strings
    s = s.replace(/(&#39;[^&#]*&#39;)/g, '<span style="color:#ce9178">$1</span>');
    // Keywords
    s = s.replace(/\b(import|export|default|from|const|let|var|return|function|if|else|new|true|false|null|undefined|async|await|class|extends)\b/g,
      '<span style="color:#569cd6">$1</span>');
    // React/RN components
    s = s.replace(/\b(React|useState|useEffect|View|Text|StyleSheet|TouchableOpacity|Image|TextInput|ScrollView|SafeAreaView|Alert|Switch|NavigationContainer|Stack)\b/g,
      '<span style="color:#4ec9b0">$1</span>');
    // JSX tags
    s = s.replace(/(&lt;\/?[A-Z][A-Za-z]*)/g, '<span style="color:#4ec9b0">$1</span>');
    // Numbers
    s = s.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#b5cea8">$1</span>');
  } else if (lang === 'json') {
    // Keys
    s = s.replace(/"([^"]+)":/g, '"<span style="color:#9cdcfe">$1</span>":');
    // String values
    s = s.replace(/: "([^"]*)"/g, ': "<span style="color:#ce9178">$1</span>"');
    // Booleans/numbers
    s = s.replace(/: (true|false|null|\d+)/g, ': <span style="color:#b5cea8">$1</span>');
  }

  return s;
}

export default function AppBuild({ onClose }) {
  const { project } = useApp();
  const [current, setCurrent] = useState(0);

  const slides = generateExpoProject(project);
  const slide = slides[current];
  const progress = ((current + 1) / slides.length) * 100;

  const go = (n) => setCurrent(Math.max(0, Math.min(slides.length - 1, n)));

  const handleOverlay = (e) => { if (e.target === e.currentTarget) onClose(); };

  const totalComponents = project.screens.reduce((a, s) => a + (s.elements?.length || 0), 0);

  return (
    <div className="modal-overlay" onClick={handleOverlay}>
      <div className="modal-build" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-icon">
            <Rocket size={20} />
          </div>
          <div>
            <div className="modal-title">AppBuild — Blueprint do Projeto</div>
            <div className="modal-subtitle">
              Tutorial completo: do zero à Play Store &nbsp;·&nbsp;
              {project.screens.length} tela{project.screens.length !== 1 ? 's' : ''} &nbsp;·&nbsp;
              {totalComponents} componentes
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <X size={16} />
          </button>
        </div>

        {/* Step pills */}
        <div className="slide-nav">
          <button className="slide-nav-btn" disabled={current === 0} onClick={() => go(current - 1)}>
            <ChevronLeft size={14} />
          </button>
          {slides.map((s, idx) => (
            <button
              key={idx}
              className={`slide-pip${idx === current ? ' active' : ''}`}
              onClick={() => go(idx)}
              title={s.title}
            >
              {idx + 1}
            </button>
          ))}
          <button className="slide-nav-btn" disabled={current === slides.length - 1} onClick={() => go(current + 1)}>
            <ChevronRight size={14} />
          </button>
          <span className="slide-counter">Passo {current + 1} de {slides.length}</span>
        </div>

        {/* Slide */}
        {slide && (
          <div className="slide-body">
            {/* Left info panel */}
            <div className="slide-info">
              <div className="slide-step-badge">
                <BookOpen size={12} />
                Passo {slide.step}
              </div>

              <div className="slide-icon-box">
                <span style={{ fontSize: 20 }}>{STEP_ICONS[slide.icon] || '▶'}</span>
              </div>

              <div className="slide-title">{slide.title}</div>
              <div className="slide-desc">{slide.description}</div>

              {slide.file && (
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 6 }}>
                    Arquivo
                  </div>
                  <div className="slide-file-path">{slide.file}</div>
                </div>
              )}

              <div className="slide-nav-footer">
                <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, display: 'flex', gap: 8 }}>
                  <span>← → para navegar</span>
                  <span>·</span>
                  <span>Clique nos círculos</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={current === 0} onClick={() => go(current - 1)}>
                    <ChevronLeft size={12} /> Anterior
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }} disabled={current === slides.length - 1} onClick={() => go(current + 1)}>
                    Próximo <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right code panel */}
            <CodeBlock code={slide.code} language={slide.language} />
          </div>
        )}

        {/* Progress bar */}
        <div className="slide-progress">
          <div className="slide-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
