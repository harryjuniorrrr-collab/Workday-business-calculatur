import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { formatDisplayDate } from '../utils/dateCalculations';
import {
  Briefcase,
  Calendar as CalendarIcon,
  Coffee,
  Clock,
  Copy,
  Check,
  AlertCircle,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ResultsBreakdownProps {
  result: CalculationResult;
  startDateStr: string;
  endDateStr: string;
  hoursPerDay: number;
  onChangeHoursPerDay: (hours: number) => void;
  includeStartDate: boolean;
  includeEndDate: boolean;
}

export const ResultsBreakdown: React.FC<ResultsBreakdownProps> = ({
  result,
  startDateStr,
  endDateStr,
  hoursPerDay,
  onChangeHoursPerDay,
  includeStartDate,
  includeEndDate,
}) => {
  const [copied, setCopied] = useState(false);
  const [showHolidaysDetail, setShowHolidaysDetail] = useState(false);

  const handleCopy = async () => {
    const summaryText = [
      `--- Business Days Calculation Report ---`,
      `Date Range: ${formatDisplayDate(result.actualStartDate)} to ${formatDisplayDate(result.actualEndDate)}`,
      `Calculation Rules: ${includeStartDate ? 'Start included' : 'Start excluded'} · ${includeEndDate ? 'End included' : 'End excluded'}`,
      `Working Days: ${result.totalWorkingDays} days`,
      `Total Calendar Days: ${result.totalCalendarDays} days`,
      `Weekend Days Excluded: ${result.totalWeekendDays} days (${result.saturdaysCount} Saturdays, ${result.sundaysCount} Sundays)`,
      result.totalHolidaysExcluded > 0
        ? `Holidays Excluded: ${result.totalHolidaysExcluded} days (${result.holidaysInRange.map((h) => `${h.date}: ${h.name}`).join(', ')})`
        : `Holidays Excluded: 0`,
      `Equivalent Work Weeks: ${result.workingWeeks} weeks, ${result.workingDaysRemainder} days`,
      `Estimated Working Hours (${hoursPerDay}h/day): ${result.estimatedWorkingHours} hours`,
      `Working Day Ratio: ${result.workingDayPercentage}% of calendar span`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Reverse Date Notice if applicable */}
      {result.isReversed && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <span className="font-semibold">Start date was later than end date: </span>
            The calculation automatically evaluated the span from {result.actualStartDate} to {result.actualEndDate}.
          </div>
        </div>
      )}

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Working Days Card (Hero KPI) */}
        <div className="relative overflow-hidden p-5 sm:p-6 bg-blue-600 text-white rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-3 text-blue-100">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Business / Working Days
            </span>
            <Briefcase className="w-5 h-5 text-blue-200" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight font-mono tabular-nums">
              {result.totalWorkingDays}
            </span>
            <span className="text-base text-blue-100 font-medium">days</span>
          </div>
          <p className="mt-2 text-xs text-blue-100/90">
            {result.workingWeeks > 0
              ? `${result.workingWeeks} full work week${result.workingWeeks > 1 ? 's' : ''}`
              : 'Less than 1 full week'}
            {result.workingDaysRemainder > 0
              ? ` + ${result.workingDaysRemainder} day${result.workingDaysRemainder > 1 ? 's' : ''}`
              : ''}
            {' '}({result.workingDayPercentage}% of span)
          </p>
        </div>

        {/* Total Calendar Days Card */}
        <div className="p-5 sm:p-6 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3 text-slate-500 dark:text-slate-400">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Total Calendar Days
            </span>
            <CalendarIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
              {result.totalCalendarDays}
            </span>
            <span className="text-base text-slate-500 dark:text-slate-400 font-medium">
              days
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {includeStartDate && includeEndDate
              ? 'Both start and end dates included'
              : includeStartDate
              ? 'Start included, end excluded'
              : includeEndDate
              ? 'Start excluded, end included'
              : 'Both start and end excluded'}
          </p>
        </div>
      </div>

      {/* Secondary Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <Coffee className="w-3.5 h-3.5 text-amber-500" />
            <span>Weekend Days</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {result.totalWeekendDays}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {result.saturdaysCount} Sat · {result.sundaysCount} Sun
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <CalendarIcon className="w-3.5 h-3.5 text-purple-500" />
            <span>Holidays</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {result.totalHolidaysExcluded}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {result.holidaysInRange.length} in range
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>Hours</span>
            </div>
            <select
              value={hoursPerDay}
              onChange={(e) => onChangeHoursPerDay(Number(e.target.value))}
              className="text-[11px] bg-transparent border-none text-blue-600 dark:text-blue-400 font-medium focus:ring-0 p-0 cursor-pointer"
              title="Change working hours per day"
            >
              <option value={7}>7h/d</option>
              <option value={7.5}>7.5h/d</option>
              <option value={8}>8h/d</option>
              <option value={8.5}>8.5h/d</option>
              <option value={9}>9h/d</option>
              <option value={10}>10h/d</option>
            </select>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {result.estimatedWorkingHours}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            at {hoursPerDay} hrs/workday
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-500" />
            <span>Work Weeks</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {(result.totalWorkingDays / 5).toFixed(1)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            5-day standard basis
          </div>
        </div>
      </div>

      {/* Holidays in Range List if any */}
      {result.holidaysInRange.length > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
          <button
            type="button"
            onClick={() => setShowHolidaysDetail(!showHolidaysDetail)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <span>
              Public Holidays in Selected Range ({result.holidaysInRange.length})
            </span>
            {showHolidaysDetail ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showHolidaysDetail && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
              {result.holidaysInRange.map((h) => (
                <div
                  key={h.date}
                  className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 py-1 border-b border-slate-100 dark:border-slate-800 last:border-none"
                >
                  <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                    {formatDisplayDate(h.date)}
                  </span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {h.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Bar (Copy, Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Calculated for: <span className="font-mono text-slate-700 dark:text-slate-300">{result.actualStartDate}</span> to <span className="font-mono text-slate-700 dark:text-slate-300">{result.actualEndDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
            <span>Print View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
