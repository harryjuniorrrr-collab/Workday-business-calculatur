import React from 'react';
import { DateRangeSettings, DayOfWeek, Holiday, CountryCode } from '../types/calculator';
import { WeekendSelector } from './WeekendSelector';
import { HolidaySelector } from './HolidaySelector';
import { formatDisplayDate, getPresetDateRange } from '../utils/dateCalculations';
import { ArrowLeftRight, Calendar as CalendarIcon, CheckSquare, Square } from 'lucide-react';

interface BetweenDatesCalculatorProps {
  settings: DateRangeSettings;
  onChangeSettings: (updater: (prev: DateRangeSettings) => DateRangeSettings) => void;
}

export const BetweenDatesCalculator: React.FC<BetweenDatesCalculatorProps> = ({
  settings,
  onChangeSettings,
}) => {
  const handleSwapDates = () => {
    onChangeSettings((prev) => ({
      ...prev,
      startDate: prev.endDate,
      endDate: prev.startDate,
    }));
  };

  const handlePreset = (preset: string) => {
    const range = getPresetDateRange(preset);
    onChangeSettings((prev) => ({
      ...prev,
      startDate: range.start,
      endDate: range.end,
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
      {/* Quick Presets Strip */}
      <div>
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Quick Range Presets
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => handlePreset('today_plus_10_biz')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Next 10 Biz Days
          </button>
          <button
            type="button"
            onClick={() => handlePreset('today_plus_30_biz')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Next 30 Biz Days
          </button>
          <button
            type="button"
            onClick={() => handlePreset('this_month')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => handlePreset('next_month')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Next Month
          </button>
          <button
            type="button"
            onClick={() => handlePreset('this_quarter')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Current Quarter
          </button>
          <button
            type="button"
            onClick={() => handlePreset('year_to_date')}
            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Year to Date
          </button>
        </div>
      </div>

      {/* Date Inputs with Swap Button */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-center">
        {/* Start Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="start-date-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            Start Date
          </label>
          <div className="relative">
            <input
              id="start-date-input"
              type="date"
              value={settings.startDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="w-full h-12 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-1">
            {formatDisplayDate(settings.startDate)}
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center md:pt-4">
          <button
            type="button"
            onClick={handleSwapDates}
            title="Swap start and end dates"
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
            aria-label="Swap start and end dates"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="end-date-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
          >
            End Date
          </label>
          <div className="relative">
            <input
              id="end-date-input"
              type="date"
              value={settings.endDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="w-full h-12 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-1">
            {formatDisplayDate(settings.endDate)}
          </div>
        </div>
      </div>

      {/* Date Inclusion Toggles (Feature 4: Include/Exclude End Date & Start Date) */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60 space-y-2.5">
        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Date Counting Rules
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={settings.includeEndDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({ ...prev, includeEndDate: e.target.checked }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
            />
            <span>
              Include <strong className="font-semibold">End Date</strong> in count
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={settings.includeStartDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({ ...prev, includeStartDate: e.target.checked }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 cursor-pointer"
            />
            <span>
              Include <strong className="font-semibold">Start Date</strong> in count
            </span>
          </label>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          Tip: Most project timelines include both dates (&quot;March 1st through March 10th&quot; = 10 calendar days). If measuring elapsed duration or SLA intervals, you may exclude the end date.
        </p>
      </div>

      {/* Weekend Exclusion (Feature 3: Exclude Saturdays & Sundays) */}
      <div className="pt-2">
        <WeekendSelector
          excludedDays={settings.excludedDaysOfWeek}
          onChange={(days) =>
            onChangeSettings((prev) => ({ ...prev, excludedDaysOfWeek: days }))
          }
        />
      </div>

      {/* Public & Custom Holidays */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <HolidaySelector
          excludeHolidays={settings.excludeHolidays}
          onToggleExcludeHolidays={(enabled) =>
            onChangeSettings((prev) => ({ ...prev, excludeHolidays: enabled }))
          }
          country={settings.country}
          onChangeCountry={(country) =>
            onChangeSettings((prev) => ({ ...prev, country }))
          }
          customHolidays={settings.customHolidays}
          onAddCustomHoliday={(holiday) =>
            onChangeSettings((prev) => ({
              ...prev,
              customHolidays: [...prev.customHolidays, holiday],
            }))
          }
          onRemoveCustomHoliday={(date) =>
            onChangeSettings((prev) => ({
              ...prev,
              customHolidays: prev.customHolidays.filter((h) => h.date !== date),
            }))
          }
        />
      </div>
    </div>
  );
};
