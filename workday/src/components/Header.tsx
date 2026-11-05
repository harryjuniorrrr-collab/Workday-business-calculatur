import React from 'react';
import { Calendar, Moon, Sun, RotateCcw } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onReset: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onReset,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <button
            onClick={() => onNavigate('calculator')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              Work<span className="text-blue-600 dark:text-blue-400">Day</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Concise Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigate('calculator')}
            className={`cursor-pointer transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              activeSection === 'calculator'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Working Days
          </button>
          <button
            onClick={() => onNavigate('add_subtract')}
            className={`cursor-pointer transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              activeSection === 'add_subtract'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Add/Subtract Days
          </button>
          <button
            onClick={() => onNavigate('calendar_view')}
            className={`cursor-pointer transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              activeSection === 'calendar_view'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Month Map
          </button>
          <button
            onClick={() => onNavigate('faq')}
            className={`cursor-pointer transition-colors whitespace-nowrap hover:text-blue-600 dark:hover:text-blue-400 ${
              activeSection === 'faq'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : ''
            }`}
          >
            Business Rules & FAQ
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onReset}
            title="Reset calculator to defaults"
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Reset calculator"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
