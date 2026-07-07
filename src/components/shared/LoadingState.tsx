import React from 'react';

interface LoadingStateProps {
  message?: string;
  type?: 'ai' | 'default';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  type = 'default'
}) => {
  if (type === 'ai') {
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
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center" role="status" aria-live="polite">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mb-2" aria-hidden="true" />
      <p className="text-xs text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
