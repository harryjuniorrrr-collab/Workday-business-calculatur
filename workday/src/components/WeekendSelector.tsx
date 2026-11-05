import React from 'react';
import { DayOfWeek } from '../types/calculator';
import { Check } from 'lucide-react';

interface WeekendSelectorProps {
  excludedDays: DayOfWeek[];
  onChange: (days: DayOfWeek[]) => void;
}

const DAYS_LIST: { id: DayOfWeek; short: string; label: string }[] = [
  { id: 1, short: 'Mon', label: 'Monday' },
  { id: 2, short: 'Tue', label: 'Tuesday' },
  { id: 3, short: 'Wed', label: 'Wednesday' },
  { id: 4, short: 'Thu', label: 'Thursday' },
  { id: 5, short: 'Fri', label: 'Friday' },
  { id: 6, short: 'Sat', label: 'Saturday' },
  { id: 0, short: 'Sun', label: 'Sunday' },
];

export const WeekendSelector: React.FC<WeekendSelectorProps> = ({
  excludedDays,
  onChange,
}) => {
  const toggleDay = (day: DayOfWeek) => {
    if (excludedDays.includes(day)) {
      onChange(excludedDays.filter((d) => d !== day));
    } else {
      onChange([...excludedDays, day]);
    }
  };

  const isStandardWeekend =
    excludedDays.length === 2 &&
    excludedDays.includes(0) &&
    excludedDays.includes(6);

  const applyPreset = (preset: 'standard' | 'gulf' | 'sunday_only' | 'none') => {
    switch (preset) {
      case 'standard':
        onChange([0, 6]); // Sun, Sat
        break;
      case 'gulf':
        onChange([5, 6]); // Fri, Sat
        break;
      case 'sunday_only':
        onChange([0]); // Sun
        break;
      case 'none':
        onChange([]);
        break;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Exclude Weekends & Non-Working Days
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {excludedDays.length === 0
            ? '7 working days / week'
            : `${7 - excludedDays.length} working days / week`}
        </span>
      </div>

      {/* Day Buttons Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS_LIST.map(({ id, short, label }) => {
          const isExcluded = excludedDays.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggleDay(id)}
              className={`h-11 sm:h-12 flex flex-col items-center justify-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                isExcluded
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold shadow-xs'
                  : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
              title={`${label}: ${isExcluded ? 'Excluded (Weekend/Off)' : 'Working Day'}`}
            >
              <span className="uppercase text-[11px] tracking-tight">{short}</span>
              <span className="text-[10px] opacity-75">
                {isExcluded ? 'Off' : 'Work'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span className="text-slate-500 dark:text-slate-400 mr-1 text-[11px]">
          Presets:
        </span>
        <button
          type="button"
          onClick={() => applyPreset('standard')}
          className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
            isStandardWeekend
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Sat & Sun
        </button>
        <button
          type="button"
          onClick={() => applyPreset('gulf')}
          className="px-2.5 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Fri & Sat
        </button>
        <button
          type="button"
          onClick={() => applyPreset('sunday_only')}
          className="px-2.5 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Sun Only
        </button>
        <button
          type="button"
          onClick={() => applyPreset('none')}
          className="px-2.5 py-1 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          No Weekends
        </button>
      </div>
    </div>
  );
};
