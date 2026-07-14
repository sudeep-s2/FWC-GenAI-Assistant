import React, { useState, useEffect, useRef } from 'react';
import { Accessibility, X, Check, Volume2, Move, Type, Eye } from 'lucide-react';

export interface AccessibilitySettings {
  speechEnabled: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  dyslexiaFont: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  speechEnabled: false,
  fontSize: 'md',
  dyslexiaFont: false,
  highContrast: false,
  reducedMotion: false,
};

const AccessibilityControlPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('stadiumos_accessibility');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  // Apply settings to document element
  useEffect(() => {
    const root = document.documentElement;

    // Apply Font Size
    root.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg', 'text-size-xl');
    root.classList.add(`text-size-${settings.fontSize}`);

    // Apply Dyslexia Font
    if (settings.dyslexiaFont) {
      root.classList.add('font-dyslexia');
    } else {
      root.classList.remove('font-dyslexia');
    }

    // Apply High Contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply Reduced Motion
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Persist Settings
    localStorage.setItem('stadiumos_accessibility', JSON.stringify(settings));
  }, [settings]);

  // Handle Escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        toggleBtnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus trap inside panel when open
  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    panel.addEventListener('keydown', handleTab);
    firstElement?.focus();

    return () => panel.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <button
        ref={toggleBtnRef}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-tr from-gold-600 to-gold-400 text-stadium-950 rounded-full shadow-2xl hover:scale-105 transition-transform duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-gold-300"
        aria-label="Open Accessibility Controls"
        aria-expanded={isOpen}
      >
        <Accessibility size={24} aria-hidden="true" />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="presentation"
          onClick={() => setIsOpen(false)}
        >
          {/* Main Dialog Box */}
          <div
            ref={panelRef}
            className="w-full max-w-md bg-stadium-900 border-2 border-stadium-700/80 rounded-2xl p-6 shadow-2xl space-y-6 fade-slide-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="accessibility-panel-title"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stadium-850 pb-4">
              <div className="flex items-center gap-2.5">
                <Accessibility className="text-gold-450" size={20} aria-hidden="true" />
                <h2 id="accessibility-panel-title" className="text-lg font-bold text-slate-100">
                  Accessibility Options
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  toggleBtnRef.current?.focus();
                }}
                className="p-1.5 hover:bg-stadium-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                aria-label="Close Accessibility Controls"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-5">
              {/* Speech Narration Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="toggle-speech" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Volume2 size={16} className="text-slate-400" />
                    Speech Narration
                  </label>
                  <p className="text-[11px] text-slate-400">Read AI responses automatically</p>
                </div>
                <button
                  id="toggle-speech"
                  role="switch"
                  aria-checked={settings.speechEnabled}
                  onClick={() => updateSetting('speechEnabled', !settings.speechEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.speechEnabled ? 'bg-gold-500' : 'bg-stadium-800'
                  }`}
                >
                  <span
                    className={`bg-stadium-950 w-4 h-4 rounded-full shadow transition-transform ${
                      settings.speechEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Text Size Customizer */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                  <Type size={16} className="text-slate-400" />
                  Font Size Adjustment
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(sz => (
                    <button
                      key={sz}
                      onClick={() => updateSetting('fontSize', sz)}
                      className={`py-2 rounded-lg border text-xs font-bold uppercase transition-all cursor-pointer ${
                        settings.fontSize === sz
                          ? 'border-gold-500 bg-gold-500/10 text-gold-450'
                          : 'border-stadium-800 text-slate-400 hover:border-stadium-700'
                      }`}
                      aria-label={`Set font size to ${sz === 'sm' ? 'small' : sz === 'md' ? 'medium' : sz === 'lg' ? 'large' : 'extra large'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dyslexia Friendly Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="toggle-dyslexia" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Type size={16} className="text-slate-400" />
                    Dyslexia-Friendly Font
                  </label>
                  <p className="text-[11px] text-slate-400">High legibility character layout</p>
                </div>
                <button
                  id="toggle-dyslexia"
                  role="switch"
                  aria-checked={settings.dyslexiaFont}
                  onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.dyslexiaFont ? 'bg-gold-500' : 'bg-stadium-800'
                  }`}
                >
                  <span
                    className={`bg-stadium-950 w-4 h-4 rounded-full shadow transition-transform ${
                      settings.dyslexiaFont ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="toggle-contrast" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Eye size={16} className="text-slate-400" />
                    High Contrast Mode
                  </label>
                  <p className="text-[11px] text-slate-400">Pure contrast rendering</p>
                </div>
                <button
                  id="toggle-contrast"
                  role="switch"
                  aria-checked={settings.highContrast}
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.highContrast ? 'bg-gold-500' : 'bg-stadium-800'
                  }`}
                >
                  <span
                    className={`bg-stadium-950 w-4 h-4 rounded-full shadow transition-transform ${
                      settings.highContrast ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label htmlFor="toggle-motion" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                    <Move size={16} className="text-slate-400" />
                    Reduced Motion
                  </label>
                  <p className="text-[11px] text-slate-400">Disable UI transitions and indicators</p>
                </div>
                <button
                  id="toggle-motion"
                  role="switch"
                  aria-checked={settings.reducedMotion}
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    settings.reducedMotion ? 'bg-gold-500' : 'bg-stadium-800'
                  }`}
                >
                  <span
                    className={`bg-stadium-950 w-4 h-4 rounded-full shadow transition-transform ${
                      settings.reducedMotion ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save/Close Button */}
            <button
              onClick={() => {
                setIsOpen(false);
                toggleBtnRef.current?.focus();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-stadium-950 font-bold rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-gold-500/10 focus:outline-none focus:ring-4 focus:ring-gold-300"
            >
              <Check size={16} aria-hidden="true" />
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityControlPanel;
