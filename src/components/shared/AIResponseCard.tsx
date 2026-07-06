import React from 'react';
import { Zap, Radio, CheckCircle, BookOpen, AlertTriangle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { AIResponse } from '../../types';

interface AIResponseCardProps {
  response: AIResponse;
  elapsedMs?: number | null;
  ragEnabled?: boolean;
}

const ConfidenceBadge: React.FC<{ confidence: string }> = ({ confidence }) => {
  const cfg: Record<string, { label: string; cls: string }> = {
    high:   { label: 'High Confidence', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    medium: { label: 'Medium Confidence', cls: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    low:    { label: 'Low Confidence', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
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
    critical: { cls: 'bg-red-500/20 text-red-400 border-red-500/40' },
    high:     { cls: 'bg-orange-500/20 text-orange-400 border-orange-500/40' },
    medium:   { cls: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
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
  const [citationsOpen, setCitationsOpen] = React.useState(false);
  const isGemini = response.source === 'GEMINI';
  const priority = response.metadata?.priority as string | undefined;

  return (
    <div
      className={`glass-card p-5 fade-slide-in ${isGemini ? 'glow-ai' : 'glow-gold'}`}
      role="region"
      aria-label="AI Response"
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
          isGemini
            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        }`}>
          {isGemini
            ? <><Zap size={14} aria-hidden="true" /><span>GEMINI AI</span></>
            : <><Radio size={14} aria-hidden="true" /><span>OFFLINE INTELLIGENCE</span></>}
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
        <div>
          <button
            onClick={() => setCitationsOpen(v => !v)}
            aria-expanded={citationsOpen}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-2 cursor-pointer"
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
    </div>
  );
});

AIResponseCard.displayName = 'AIResponseCard';
export default AIResponseCard;
