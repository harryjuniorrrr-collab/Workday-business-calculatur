import React, { useState } from 'react';
import { CountryCode, Holiday } from '../types/calculator';
import { COUNTRY_OPTIONS } from '../utils/holidays';
import { Plus, Trash2, CalendarOff, ChevronDown, ChevronUp } from 'lucide-react';

interface HolidaySelectorProps {
  excludeHolidays: boolean;
  onToggleExcludeHolidays: (enabled: boolean) => void;
  country: CountryCode;
  onChangeCountry: (country: CountryCode) => void;
  customHolidays: Holiday[];
  onAddCustomHoliday: (holiday: Holiday) => void;
  onRemoveCustomHoliday: (date: string) => void;
}

export const HolidaySelector: React.FC<HolidaySelectorProps> = ({
  excludeHolidays,
  onToggleExcludeHolidays,
  country,
  onChangeCountry,
  customHolidays,
  onAddCustomHoliday,
  onRemoveCustomHoliday,
}) => {
  const [showCustomManager, setShowCustomManager] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setErrorMsg('Please select a valid date');
      return;
    }
    if (!newName.trim()) {
      setErrorMsg('Please enter a holiday or event name');
      return;
    }

    onAddCustomHoliday({
      date: newDate,
      name: newName.trim(),
      isCustom: true,
    });

    setNewDate('');
    setNewName('');
    setErrorMsg('');
  };

  return (
    <div className="space-y-3 pt-1">
      {/* Top Toggle Row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor="exclude-holidays-toggle"
          className="text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-2"
        >
          <span>Exclude Public Holidays</span>
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            id="exclude-holidays-toggle"
            type="checkbox"
            checked={excludeHolidays}
            onChange={(e) => onToggleExcludeHolidays(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {excludeHolidays && (
        <div className="space-y-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Region / Holiday Calendar
            </label>
            <div className="relative">
              <select
                value={country}
                onChange={(e) => onChangeCountry(e.target.value as CountryCode)}
                className="w-full h-10 pl-3 pr-8 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Holidays Section Toggle */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowCustomManager(!showCustomManager)}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                Custom Company Off-Days ({customHolidays.length})
              </span>
              {showCustomManager ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showCustomManager && (
              <div className="mt-3 space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <form onSubmit={handleAddCustom} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="h-9 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="YYYY-MM-DD"
                    />
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g. Winter Shutdown"
                        className="flex-1 h-9 px-2.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium flex items-center justify-center shrink-0 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                  {errorMsg && (
                    <p className="text-[11px] text-red-600 dark:text-red-400">
                      {errorMsg}
                    </p>
                  )}
                </form>

                {customHolidays.length > 0 ? (
                  <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                    {customHolidays.map((h) => (
                      <div
                        key={h.date}
                        className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <div className="truncate mr-2">
                          <span className="font-mono font-medium text-slate-900 dark:text-white mr-2">
                            {h.date}
                          </span>
                          <span>{h.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveCustomHoliday(h.date)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove holiday"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                    No custom holidays added yet. You can add company shut-downs or internal off-days here.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
