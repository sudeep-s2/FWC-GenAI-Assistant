import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description = 'There is currently no information to show.',
  icon = <HelpCircle size={32} className="text-slate-500 mb-2" />,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center" role="status">
      <div className="flex justify-center items-center mb-2" aria-hidden="true">
        {icon}
      </div>
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-3 text-xs text-gold-400 hover:text-gold-300 font-bold border border-gold-500/30 px-2.5 py-1 rounded-lg bg-gold-500/5 cursor-pointer transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
