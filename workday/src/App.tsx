import React, { useState, useEffect } from 'react';
import {
  DateRangeSettings,
  AddSubtractSettings,
  CalculationResult,
  CountryCode,
  Holiday,
  CalculatorMode,
} from './types/calculator';
import {
  getTodayString,
  addDays,
  calculateBetweenDates,
} from './utils/dateCalculations';
import { Header } from './components/Header';
import { BetweenDatesCalculator } from './components/BetweenDatesCalculator';
import { ResultsBreakdown } from './components/ResultsBreakdown';
import { VisualCalendarView } from './components/VisualCalendarView';
import { AddSubtractDaysCalculator } from './components/AddSubtractDaysCalculator';
import { FaqSection } from './components/FaqSection';
import { Calendar, PlusCircle, CalendarDays, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('workday_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('workday_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('workday_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Active Mode: 'between_dates' | 'add_subtract'
  const [activeMode, setActiveMode] = useState<CalculatorMode>('between_dates');

  // Load custom holidays from localStorage
  const [customHolidays, setCustomHolidays] = useState<Holiday[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('workday_custom_holidays');
        if (stored) return JSON.parse(stored);
      } catch {
        // Ignore parse error
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      'workday_custom_holidays',
      JSON.stringify(customHolidays)
    );
  }, [customHolidays]);

  // Initial Date Range Settings
  const today = getTodayString();
  const defaultEnd = addDays(today, 14);

  const [dateRangeSettings, setDateRangeSettings] = useState<DateRangeSettings>(
    {
      startDate: today,
      endDate: defaultEnd,
      includeStartDate: true,
      includeEndDate: true,
      excludedDaysOfWeek: [0, 6], // Sunday & Saturday
      excludeHolidays: true,
      country: 'US',
      customHolidays,
      hoursPerDay: 8,
    }
  );

  // Sync customHolidays into dateRangeSettings
  useEffect(() => {
    setDateRangeSettings((prev) => ({
      ...prev,
      customHolidays,
    }));
  }, [customHolidays]);

  // Add/Subtract Settings
  const [addSubtractSettings, setAddSubtractSettings] =
    useState<AddSubtractSettings>({
      startDate: today,
      operation: 'add',
      amount: 10,
      countingType: 'working',
      includeStartDate: false,
      excludedDaysOfWeek: [0, 6],
      excludeHolidays: true,
      country: 'US',
      customHolidays,
      hoursPerDay: 8,
    });

  useEffect(() => {
    setAddSubtractSettings((prev) => ({
      ...prev,
      customHolidays,
    }));
  }, [customHolidays]);

  // Real-time calculation for between dates
  const calculationResult: CalculationResult =
    calculateBetweenDates(dateRangeSettings);

  const handleReset = () => {
    const freshToday = getTodayString();
    setDateRangeSettings({
      startDate: freshToday,
      endDate: addDays(freshToday, 14),
      includeStartDate: true,
      includeEndDate: true,
      excludedDaysOfWeek: [0, 6],
      excludeHolidays: true,
      country: 'US',
      customHolidays,
      hoursPerDay: 8,
    });
    setAddSubtractSettings({
      startDate: freshToday,
      operation: 'add',
      amount: 10,
      countingType: 'working',
      includeStartDate: false,
      excludedDaysOfWeek: [0, 6],
      excludeHolidays: true,
      country: 'US',
      customHolidays,
      hoursPerDay: 8,
    });
  };

  const scrollToSection = (section: string) => {
    if (section === 'calculator') {
      setActiveMode('between_dates');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'add_subtract') {
      setActiveMode('add_subtract');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (section === 'calendar_view') {
      setActiveMode('between_dates');
      const el = document.getElementById('visual-calendar-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (section === 'faq') {
      const el = document.getElementById('faq-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onReset={handleReset}
        activeSection={activeMode}
        onNavigate={scrollToSection}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header Area */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Business Days Calculator
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
                Accurately compute working days, calendar days, weekends, and holidays between dates or pinpoint exact project deadlines.
              </p>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl self-start sm:self-auto border border-slate-300/50 dark:border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveMode('between_dates')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeMode === 'between_dates'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Days Between Dates</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('add_subtract')}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeMode === 'add_subtract'
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add / Subtract Days</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Calculator View */}
        {activeMode === 'between_dates' ? (
          <div className="space-y-8">
            {/* Top 2-Column Split: Controls on Left, Results on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Date Range Input & Options (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <BetweenDatesCalculator
                  settings={dateRangeSettings}
                  onChangeSettings={setDateRangeSettings}
                />
              </div>

              {/* Right Column: Hero KPIs & Breakdown (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <ResultsBreakdown
                  result={calculationResult}
                  startDateStr={dateRangeSettings.startDate}
                  endDateStr={dateRangeSettings.endDate}
                  hoursPerDay={dateRangeSettings.hoursPerDay}
                  onChangeHoursPerDay={(h) =>
                    setDateRangeSettings((prev) => ({ ...prev, hoursPerDay: h }))
                  }
                  includeStartDate={dateRangeSettings.includeStartDate}
                  includeEndDate={dateRangeSettings.includeEndDate}
                />
              </div>
            </div>

            {/* Visual Month Calendar View */}
            <div id="visual-calendar-section" className="pt-2">
              <VisualCalendarView result={calculationResult} />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-8">
            <AddSubtractDaysCalculator
              settings={addSubtractSettings}
              onChangeSettings={setAddSubtractSettings}
            />
          </div>
        )}

        {/* Business Rules & FAQ Section */}
        <div id="faq-section" className="pt-4">
          <FaqSection />
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              WorkDay
            </span>
            <span>·</span>
            <span>High-precision business date calculations</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => scrollToSection('calculator')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Working Days
            </button>
            <button
              onClick={() => scrollToSection('add_subtract')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              Add/Subtract
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
