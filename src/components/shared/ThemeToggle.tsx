import React from 'react';
import { Sun, Moon, Coffee } from 'lucide-react';
import { useTheme, type ThemeType } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options: { id: ThemeType; label: string; icon: React.ReactNode }[] = [
    { id: 'light', label: 'Light', icon: <Sun size={14} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={14} /> },
    { id: 'chai', label: 'Chai', icon: <Coffee size={14} /> },
  ];

  return (
    <div 
      className="flex items-center gap-1 p-1 bg-stadium-900/60 rounded-xl border border-stadium-700/50 shadow-inner"
      role="group"
      aria-label="Select Theme Mode"
    >
      {options.map((opt) => {
        const active = theme === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => setTheme(opt.id)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
              active
                ? 'bg-gold-500 text-stadium-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title={`Set theme to ${opt.label}`}
          >
            {opt.icon}
            <span className="hidden sm:inline">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ThemeToggle;
