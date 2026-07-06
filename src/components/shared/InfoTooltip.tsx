import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
  content: string;
  label?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, label = 'Help information' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative inline-block ml-1.5 shrink-0 align-middle">
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label={label}
        aria-describedby="tooltip-content"
        className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded-full hover:bg-stadium-700/20 cursor-help focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-500"
      >
        <HelpCircle size={14} aria-hidden="true" />
      </button>

      {visible && (
        <div
          id="tooltip-content"
          role="tooltip"
          className="absolute z-50 w-52 p-2.5 mt-2 text-xs leading-normal text-slate-300 bg-stadium-900 border border-stadium-700 rounded-lg shadow-xl -left-24 sm:-left-24 fade-slide-in"
          style={{ transform: 'translateX(0)' }}
        >
          <div className="absolute top-0 left-1/2 -mt-1 -ml-1 border-4 border-transparent border-b-stadium-700" />
          {content}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
