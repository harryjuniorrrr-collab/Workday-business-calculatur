import React from 'react';
import {
  AddSubtractResult,
  AddSubtractSettings,
  CountryCode,
  DayOfWeek,
  Holiday,
} from '../types/calculator';
import { WeekendSelector } from './WeekendSelector';
import { HolidaySelector } from './HolidaySelector';
import {
  formatDisplayDate,
  calculateAddSubtractDays,
} from '../utils/dateCalculations';
import {
  Calendar as CalendarIcon,
  ArrowRight,
  Plus,
  Minus,
  Sparkles,
  Clock,
  Coffee,
} from 'lucide-react';

interface AddSubtractDaysCalculatorProps {
  settings: AddSubtractSettings;
  onChangeSettings: (
    updater: (prev: AddSubtractSettings) => AddSubtractSettings
  ) => void;
}

export const AddSubtractDaysCalculator: React.FC<
  AddSubtractDaysCalculatorProps
> = ({ settings, onChangeSettings }) => {
  const result: AddSubtractResult = calculateAddSubtractDays(settings);

  const quickAmounts = [5, 10, 14, 20, 30, 60, 90];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Add or Subtract Business Days
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Calculate the exact target completion date or project deadline skipping non-working days
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          {/* Start Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="add-sub-start-date"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
            >
              Start Date
            </label>
            <input
              id="add-sub-start-date"
              type="date"
              value={settings.startDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({
                  ...prev,
                  startDate: e.target.value,
                }))
              }
              className="w-full h-12 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
            />
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-1">
              {formatDisplayDate(settings.startDate)}
            </div>
          </div>

          {/* Operation (Add / Subtract) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Operation
            </label>
            <div className="grid grid-cols-2 gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/60 h-12 items-center">
              <button
                type="button"
                onClick={() =>
                  onChangeSettings((prev) => ({ ...prev, operation: 'add' }))
                }
                className={`h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  settings.operation === 'add'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add (+)</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  onChangeSettings((prev) => ({
                    ...prev,
                    operation: 'subtract',
                  }))
                }
                className={`h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  settings.operation === 'subtract'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Subtract (-)</span>
              </button>
            </div>
          </div>

          {/* Amount of days */}
          <div className="space-y-1.5">
            <label
              htmlFor="days-count-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider"
            >
              Number of Days
            </label>
            <div className="relative">
              <input
                id="days-count-input"
                type="number"
                min="0"
                max="3650"
                value={settings.amount}
                onChange={(e) =>
                  onChangeSettings((prev) => ({
                    ...prev,
                    amount: Math.max(0, parseInt(e.target.value, 10) || 0),
                  }))
                }
                className="w-full h-12 px-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold font-mono tabular-nums text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate pl-1">
              Days to {settings.operation}
            </div>
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">
            Quick:
          </span>
          {quickAmounts.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() =>
                onChangeSettings((prev) => ({ ...prev, amount: q }))
              }
              className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                settings.amount === q
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-medium'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {q} days
            </button>
          ))}
        </div>

        {/* Day Type (Working Days vs Calendar Days) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <label
            onClick={() =>
              onChangeSettings((prev) => ({ ...prev, countingType: 'working' }))
            }
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              settings.countingType === 'working'
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500/50 text-slate-900 dark:text-white shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="countingType"
                checked={settings.countingType === 'working'}
                onChange={() => {}}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold">
                Business / Working Days Only
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
              Skips weekends and configured public holidays. Standard for delivery SLAs and contracts.
            </p>
          </label>

          <label
            onClick={() =>
              onChangeSettings((prev) => ({ ...prev, countingType: 'calendar' }))
            }
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              settings.countingType === 'calendar'
                ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-500/50 text-slate-900 dark:text-white shadow-2xs'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <input
                type="radio"
                name="countingType"
                checked={settings.countingType === 'calendar'}
                onChange={() => {}}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-semibold">
                Consecutive Calendar Days
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 pl-5">
              Counts all 7 days of the week consecutively including weekends and holidays.
            </p>
          </label>
        </div>

        {/* Start Date Inclusion Option */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <input
              type="checkbox"
              checked={settings.includeStartDate}
              onChange={(e) =>
                onChangeSettings((prev) => ({
                  ...prev,
                  includeStartDate: e.target.checked,
                }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
            />
            <span>
              Count <strong className="font-semibold">Start Date</strong> as Day 1
            </span>
          </label>
        </div>

        {/* Weekend Options */}
        {settings.countingType === 'working' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <WeekendSelector
              excludedDays={settings.excludedDaysOfWeek}
              onChange={(days) =>
                onChangeSettings((prev) => ({
                  ...prev,
                  excludedDaysOfWeek: days,
                }))
              }
            />
          </div>
        )}

        {/* Holidays Options */}
        {settings.countingType === 'working' && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <HolidaySelector
              excludeHolidays={settings.excludeHolidays}
              onToggleExcludeHolidays={(enabled) =>
                onChangeSettings((prev) => ({
                  ...prev,
                  excludeHolidays: enabled,
                }))
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
                  customHolidays: prev.customHolidays.filter(
                    (h) => h.date !== date
                  ),
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Target Date Result Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider font-semibold">
          <span>Target Result Date</span>
          <span className="text-blue-400 font-medium normal-case">
            {settings.operation === 'add' ? `+${settings.amount}` : `-${settings.amount}`}{' '}
            {settings.countingType === 'working' ? 'business days' : 'calendar days'}
          </span>
        </div>

        <div>
          <div className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white mb-1">
            {formatDisplayDate(result.targetDate)}
          </div>
          <div className="text-sm text-slate-300">
            Exact ISO Date: <span className="font-mono text-blue-400 font-semibold">{result.targetDate}</span>
          </div>
        </div>

        {/* Spanned Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <div className="text-slate-400">Total Calendar Days</div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {result.totalCalendarDaysSpanned}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Working Days Spanned</div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {result.totalWorkingDaysSpanned}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Weekends Passed</div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {result.totalWeekendDaysSpanned}
            </div>
          </div>
          <div>
            <div className="text-slate-400">Holidays Passed</div>
            <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
              {result.totalHolidaysSpanned}
            </div>
          </div>
        </div>

        {result.holidaysList.length > 0 && (
          <div className="pt-2 text-xs text-slate-300">
            <span className="font-semibold text-purple-300">
              Holidays encountered ({result.holidaysList.length}):{' '}
            </span>
            {result.holidaysList.map((h) => `${h.name} (${h.date})`).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};
