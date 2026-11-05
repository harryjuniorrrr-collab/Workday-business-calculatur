import React, { useState } from 'react';
import { CalculationResult } from '../types/calculator';
import { parseDateString, formatDateString } from '../utils/dateCalculations';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface VisualCalendarViewProps {
  result: CalculationResult;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const VisualCalendarView: React.FC<VisualCalendarViewProps> = ({ result }) => {
  const dayDetailsMap = new Map(result.dayDetails.map((d) => [d.date, d]));

  // Find start and end month
  const startDate = parseDateString(result.actualStartDate);
  const endDate = parseDateString(result.actualEndDate);

  const [currentYear, setCurrentYear] = useState<number>(startDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(startDate.getMonth());

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Build grid for currentYear and currentMonth
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Days array with leading empty slots
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push(dateStr);
  }

  return (
    <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">
            Visual Month Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspect working days, weekends, and holidays across the calendar span
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 min-w-36 text-center font-mono">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((dateStr, index) => {
          if (!dateStr) {
            return (
              <div
                key={`empty-${index}`}
                className="h-12 sm:h-14 rounded-lg bg-slate-50/50 dark:bg-slate-900/30 border border-transparent"
              />
            );
          }

          const dayNumber = parseInt(dateStr.split('-')[2], 10);
          const detail = dayDetailsMap.get(dateStr);
          const inRange = Boolean(detail);

          let cellClass =
            'bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 text-slate-400 dark:text-slate-600';
          let badgeText = '';

          if (inRange && detail) {
            if (detail.isHoliday) {
              cellClass =
                'bg-purple-500/10 border-purple-500/40 text-purple-800 dark:text-purple-300 font-semibold';
              badgeText = 'Holiday';
            } else if (detail.isWeekend) {
              cellClass =
                'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300 font-medium';
              badgeText = 'Weekend';
            } else if (detail.isWorkingDay) {
              cellClass =
                'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300 font-semibold';
              badgeText = 'Work';
            }

            if (detail.isStartOrEnd) {
              cellClass += ' ring-2 ring-blue-600 dark:ring-blue-400 ring-offset-1 dark:ring-offset-slate-900';
            }
          }

          return (
            <div
              key={dateStr}
              title={
                detail
                  ? `${dateStr} (${detail.dayName}): ${
                      detail.isHoliday
                        ? `Holiday - ${detail.holidayName}`
                        : detail.isWeekend
                        ? 'Weekend'
                        : 'Working Day'
                    }${detail.isStartOrEnd ? ` [${detail.isStartOrEnd.toUpperCase()}]` : ''}`
                  : `${dateStr} (Outside selected range)`
              }
              className={`h-12 sm:h-14 p-1 rounded-lg flex flex-col justify-between transition-all text-xs ${cellClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tabular-nums font-medium">
                  {dayNumber}
                </span>
                {detail?.isStartOrEnd && (
                  <span className="text-[9px] uppercase tracking-wider font-bold px-1 rounded bg-blue-600 text-white leading-tight">
                    {detail.isStartOrEnd === 'both' ? 'S/E' : detail.isStartOrEnd === 'start' ? 'Start' : 'End'}
                  </span>
                )}
              </div>
              {inRange && (
                <span className="text-[10px] leading-tight truncate">
                  {badgeText}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/20 border border-blue-500/50"></span>
          <span>Working Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/50"></span>
          <span>Weekend / Off-Day</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-purple-500/20 border border-purple-500/50"></span>
          <span>Public / Custom Holiday</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded ring-2 ring-blue-600 bg-white dark:bg-slate-800"></span>
          <span>Selected Start / End</span>
        </div>
      </div>
    </div>
  );
};
