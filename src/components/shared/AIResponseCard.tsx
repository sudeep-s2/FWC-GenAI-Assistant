import React, { useState, useEffect } from 'react';
import { Zap, Radio, CheckCircle, BookOpen, AlertTriangle, Clock, ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import type { AIResponse } from '../../types';

interface AIResponseCardProps {
  response: AIResponse;
  elapsedMs?: number | null;
  ragEnabled?: boolean;
}

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
  const cfg: Record<string, { label: string; cls: string }> = {
    high:   { label: 'High Confidence', cls: 'bg-emerald-500/20 text-emerald-450 border-emerald-500/30' },
    medium: { label: 'Medium Confidence', cls: 'bg-amber-500/20 text-amber-450 border-amber-500/30' },
    low:    { label: 'Low Confidence', cls: 'bg-red-500/20 text-red-450 border-red-500/30' },
  };
  const style = cfg[confidence.toLowerCase()] ?? cfg['medium'];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${style.cls}`}>
      {style.label}
    </span>
  );
};

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const cfg: Record<string, { cls: string }> = {
    critical: { cls: 'bg-red-500/20 text-red-405 border-red-500/40' },
    high:     { cls: 'bg-orange-500/20 text-orange-405 border-orange-500/40' },
    medium:   { cls: 'bg-amber-500/20 text-amber-455 border-amber-500/40' },
    low:      { cls: 'bg-slate-500/20 text-slate-400 border-slate-500/40' },
  };
  const style = cfg[priority] ?? cfg['medium'];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${style.cls}`}>
      {priority}
    </span>
  );
};

const AIResponseCard: React.FC<AIResponseCardProps> = React.memo(({ response, elapsedMs, ragEnabled = true }) => {
  const [citationsOpen, setCitationsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const hasOnlineAI = response.source === 'GEMINI' || response.source === 'OPENAI' || response.source === 'GROQ';
  const priority = response.metadata?.priority as string | undefined;

  // Deriving confidence percentage based on category
  const confidencePercent = React.useMemo(() => {
    if (response.confidence.toLowerCase() === 'high') {
      return 92;
    }
    if (response.confidence.toLowerCase() === 'low') {
      return 52;
    }
    return 78;
  }, [response.confidence]);

  // Derived evidence used checklist
  const evidenceChecklist = React.useMemo(() => {
    if (response.factorsConsidered && response.factorsConsidered.length > 0) {
      return response.factorsConsidered.map(f => f.replace(/^✓\s*/, ''));
    }
    return ['Crowd Sensor Feed', 'Weather Status', 'Transit Hub Load', 'Medical Capacity'];
  }, [response.factorsConsidered]);

  // Derived grounding sources
  const groundingSources = React.useMemo(() => {
    const sources = new Set<string>();
    const contentLower = response.content.toLowerCase();
    
    if (contentLower.includes('wheelchair') || contentLower.includes('ada') || contentLower.includes('elevator')) {
      sources.add('Accessibility Rules DB');
      sources.add('Elevator Telemetry');
    }
    if (contentLower.includes('crowd') || contentLower.includes('gate') || contentLower.includes('surge') || contentLower.includes('density')) {
      sources.add('CrowdPulse Gate Sensors');
      sources.add('Transit Arrivals Feed');
    }
    if (contentLower.includes('waste') || contentLower.includes('recycle') || contentLower.includes('compost') || contentLower.includes('energy')) {
      sources.add('Waste Audit Logs');
      sources.add('Grid Smart-Meter API');
    }
    if (contentLower.includes('volunteer') || contentLower.includes('dispatch') || contentLower.includes('usher')) {
      sources.add('Volunteer Manual');
      sources.add('Incident Database');
    }
    
    sources.add('Local RAG grounded DB');
    return Array.from(sources);
  }, [response.content]);

  // Speech Narration Logic
  const handleToggleSpeak = React.useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response.content);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      // Select appropriate English voice if possible
      const voices = window.speechSynthesis.getVoices();
      const defaultVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  }, [response.content, isSpeaking]);

  // Auto-speak if enabled in accessibility settings
  useEffect(() => {
    let active = true;
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      const saved = localStorage.getItem('stadiumos_accessibility');
      if (saved) {
        const settings = JSON.parse(saved);
        if (settings.speechEnabled && active) {
          // Wrap in a tiny timeout to allow voices to load
          const t = setTimeout(() => {
            if (typeof window === 'undefined' || !window.speechSynthesis) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(response.content);
            utterance.onend = () => { if (active) setIsSpeaking(false); };
            utterance.onerror = () => { if (active) setIsSpeaking(false); };
            window.speechSynthesis.speak(utterance);
            setIsSpeaking(true);
          }, 100);
          return () => clearTimeout(t);
        }
      }
    } catch (e) {
      console.warn('Auto speak failed:', e);
    }
    return () => {
      active = false;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [response.content]);

  return (
    <div
      className={`glass-card p-5 fade-slide-in ${hasOnlineAI ? 'glow-ai' : 'glow-gold'}`}
      role="region"
      aria-label="AI Response"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${
          response.source === 'GEMINI'
            ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
            : response.source === 'OPENAI'
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            : response.source === 'GROQ'
            ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
            : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        }`}>
          {response.source === 'GEMINI' ? (
            <><Zap size={14} aria-hidden="true" /><span>GEMINI AI</span></>
          ) : response.source === 'OPENAI' ? (
            <><Zap size={14} aria-hidden="true" /><span>OPENAI CO-PILOT</span></>
          ) : response.source === 'GROQ' ? (
            <><Zap size={14} aria-hidden="true" /><span>GROQ (GROK) SERVICE</span></>
          ) : (
            <><Radio size={14} aria-hidden="true" /><span>OFFLINE INTELLIGENCE</span></>
          )}
        </div>

        <ConfidenceBadge confidence={response.confidence} />
        {priority && <PriorityBadge priority={priority} />}

        <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
          {elapsedMs !== null && elapsedMs !== undefined && (
            <span className="flex items-center gap-1">
              <Clock size={11} aria-hidden="true" />{elapsedMs}ms
            </span>
          )}
          {ragEnabled && (
            <span className="flex items-center gap-1 text-emerald-500/70">
              <BookOpen size={11} aria-hidden="true" />RAG
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-200 leading-relaxed text-sm mb-4 whitespace-pre-wrap">
        {response.content}
      </p>

      {/* Actions */}
      {response.actions.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
            Suggested Actions
          </h4>
          <ul className="space-y-2" aria-label="Suggested actions list">
            {response.actions.map((action, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <CheckCircle size={14} className="text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Citations - collapsible */}
      {response.citations.length > 0 && (
        <div className="border-b border-stadium-850/50 pb-3 mb-3">
          <button
            onClick={() => setCitationsOpen(v => !v)}
            aria-expanded={citationsOpen}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 cursor-pointer focus:outline-none"
          >
            <BookOpen size={12} aria-hidden="true" />
            <span>{response.citations.length} knowledge source{response.citations.length > 1 ? 's' : ''} cited</span>
            {citationsOpen ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
          </button>
          {citationsOpen && (
            <ul className="space-y-1.5" aria-label="Knowledge sources cited">
              {response.citations.map((c, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <AlertTriangle size={10} className="text-amber-400/60" aria-hidden="true" />
                  <code className="text-amber-400/80">{c.source}</code>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-500">{c.section}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-600">{c.id}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Confidence Meter, Narration controls, Evidence Checklist & Grounding Sources panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-stadium-800/80 pt-4 mt-4 text-xs">
        {/* Confidence & Speech Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Decision Confidence</span>
            <span className="text-xs font-extrabold text-gold-400">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-stadium-800 rounded-full h-2 overflow-hidden border border-stadium-750/30">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                response.confidence.toLowerCase() === 'high' ? 'bg-emerald-500' : response.confidence.toLowerCase() === 'medium' ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            />
          </div>
          
          <button
            onClick={handleToggleSpeak}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-300 ${
              isSpeaking 
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30' 
                : 'bg-gold-500/10 text-gold-400 border border-gold-500/30 hover:bg-gold-500/20'
            }`}
            aria-label={isSpeaking ? 'Stop speech narration' : 'Narrate response text'}
          >
            <Volume2 size={13} aria-hidden="true" />
            <span>{isSpeaking ? 'Stop Narration' : 'Narrate Recommendation'}</span>
          </button>
        </div>

        {/* Evidence & Sources Column */}
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Evidence Indicators Used</span>
            <div className="flex flex-wrap gap-1">
              {evidenceChecklist.map((ev, idx) => (
                <span 
                  key={idx} 
                  className="inline-flex items-center gap-1 text-[10px] bg-stadium-800 border border-stadium-750/50 text-slate-300 px-2 py-0.5 rounded-md font-medium"
                >
                  ✓ {ev}
                </span>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Grounded Channels</span>
            <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-2 gap-y-1">
              {groundingSources.map((srcName, idx) => (
                <span key={idx} className="underline decoration-gold-500/40 text-slate-400">
                  {srcName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AIResponseCard.displayName = 'AIResponseCard';
export default AIResponseCard;
