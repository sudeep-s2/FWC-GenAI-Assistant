import React from 'react';

interface AILoadingStateProps {
  message?: string;
}

const AILoadingState: React.FC<AILoadingStateProps> = ({ message = 'Analyzing stadium intelligence...' }) => {
  const steps = [
    { label: 'Reading live telemetry data', delay: '0s' },
    { label: 'Querying local RAG knowledge documents', delay: '0.3s' },
    { label: 'Formatting safety directives & generating response', delay: '0.6s' }
  ];

  return (
    <div className="glass-card p-5 border border-ai-500/20 glow-ai space-y-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-ai-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        <span className="text-sm font-semibold text-ai-400">{message}</span>
      </div>
      <div className="space-y-2.5 pl-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-500">
            <div 
              className="w-1.5 h-1.5 rounded-full bg-ai-500 live-dot" 
              style={{ animationDelay: step.delay }} 
              aria-hidden="true" 
            />
            <span>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AILoadingState;
