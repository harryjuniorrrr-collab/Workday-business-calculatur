import {
  AddSubtractResult,
  AddSubtractSettings,
  CalculationResult,
  CountryCode,
  DateRangeSettings,
  DayDetail,
  DayOfWeek,
  Holiday,
} from '../types/calculator';
import { getPublicHolidays } from './holidays';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function parseDateString(str: string): Date {
  const parts = str.split('-');
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  return new Date(y, m, d, 12, 0, 0, 0);
}

export function formatDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseDateString(dateStr);
  const dayName = DAY_NAMES[d.getDay()];
  const monthName = MONTH_NAMES[d.getMonth()];
  return `${dayName}, ${monthName} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseDateString(dateStr);
  const monthName = MONTH_NAMES[d.getMonth()].substring(0, 3);
  return `${monthName} ${d.getDate()}, ${d.getFullYear()}`;
}

export function getTodayString(): string {
  return formatDateString(new Date());
}

export function addDays(dateStr: string, days: number): string {
  const d = parseDateString(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateString(d);
}

// Check if a day is excluded weekend day
export function isWeekendDay(dayOfWeek: DayOfWeek, excludedDays: DayOfWeek[]): boolean {
  return excludedDays.includes(dayOfWeek);
}

// Compile a lookup map for holidays for fast O(1) checks
export function buildHolidaysMap(
  country: CountryCode,
  startYear: number,
  endYear: number,
  customHolidays: Holiday[] = []
): Map<string, Holiday> {
  const map = new Map<string, Holiday>();
  
  if (country !== 'NONE') {
    const list = getPublicHolidays(country, startYear, endYear);
    list.forEach(h => map.set(h.date, h));
  }

  customHolidays.forEach(h => {
    map.set(h.date, { ...h, isCustom: true });
  });

  return map;
}

export function calculateBetweenDates(settings: DateRangeSettings): CalculationResult {
  const {
    startDate,
    endDate,
    includeStartDate,
    includeEndDate,
    excludedDaysOfWeek,
    excludeHolidays,
    country,
    customHolidays,
    hoursPerDay,
  } = settings;

  const d1 = parseDateString(startDate);
  const d2 = parseDateString(endDate);

  const isReversed = d1.getTime() > d2.getTime();
  const actualStart = isReversed ? endDate : startDate;
  const actualEnd = isReversed ? startDate : endDate;

  const sDate = parseDateString(actualStart);
  const eDate = parseDateString(actualEnd);

  const startYear = Math.min(sDate.getFullYear(), eDate.getFullYear());
  const endYear = Math.max(sDate.getFullYear(), eDate.getFullYear());

  const holidaysMap = excludeHolidays
    ? buildHolidaysMap(country, startYear, endYear, customHolidays)
    : new Map<string, Holiday>();

  const dayDetails: DayDetail[] = [];
  const holidaysInRange: Holiday[] = [];

  let totalCalendarDays = 0;
  let totalWorkingDays = 0;
  let totalWeekendDays = 0;
  let saturdaysCount = 0;
  let sundaysCount = 0;
  let otherExcludedDaysCount = 0;
  let totalHolidaysExcluded = 0; // Holidays that fell on non-weekend days

  // Traverse day by day from actualStart to actualEnd
  const current = new Date(sDate.getTime());
  
  while (current.getTime() <= eDate.getTime()) {
    const dateStr = formatDateString(current);
    const dayOfWeek = current.getDay() as DayOfWeek;
    const isFirstDay = dateStr === actualStart;
    const isLastDay = dateStr === actualEnd;

    // Determine inclusion
    let isIncludedInCount = true;
    if (isFirstDay && !includeStartDate) {
      isIncludedInCount = false;
    }
    if (isLastDay && !includeEndDate) {
      isIncludedInCount = false;
    }
    // If start == end and both or either is excluded
    if (actualStart === actualEnd) {
      isIncludedInCount = includeStartDate && includeEndDate;
    }

    const isWeekend = isWeekendDay(dayOfWeek, excludedDaysOfWeek);
    const holidayInfo = excludeHolidays ? holidaysMap.get(dateStr) : undefined;
    const isHoliday = Boolean(holidayInfo);

    let isStartOrEnd: 'start' | 'end' | 'both' | undefined = undefined;
    if (actualStart === actualEnd) {
      isStartOrEnd = 'both';
    } else if (isFirstDay) {
      isStartOrEnd = 'start';
    } else if (isLastDay) {
      isStartOrEnd = 'end';
    }

    const isWorkingDay = isIncludedInCount && !isWeekend && !isHoliday;

    if (isIncludedInCount) {
      totalCalendarDays++;

      if (isWeekend) {
        totalWeekendDays++;
        if (dayOfWeek === 6) saturdaysCount++;
        else if (dayOfWeek === 0) sundaysCount++;
        else otherExcludedDaysCount++;
      } else if (isHoliday) {
        totalHolidaysExcluded++;
      } else {
        totalWorkingDays++;
      }
    }

    if (isHoliday && holidayInfo && isIncludedInCount) {
      holidaysInRange.push(holidayInfo);
    }

    dayDetails.push({
      date: dateStr,
      dayOfWeek,
      dayName: DAY_NAMES[dayOfWeek],
      isWeekend,
      isHoliday,
      holidayName: holidayInfo?.name,
      isWorkingDay,
      isStartOrEnd,
    });

    current.setDate(current.getDate() + 1);
  }

  // Work weeks calculation: based on how many working days in a week
  const workingDaysPerWeek = 7 - excludedDaysOfWeek.length || 5;
  const workingWeeks = Math.floor(totalWorkingDays / workingDaysPerWeek);
  const workingDaysRemainder = totalWorkingDays % workingDaysPerWeek;
  const estimatedWorkingHours = totalWorkingDays * (hoursPerDay || 8);
  const workingDayPercentage =
    totalCalendarDays > 0 ? Math.round((totalWorkingDays / totalCalendarDays) * 1000) / 10 : 0;

  return {
    totalCalendarDays,
    totalWorkingDays,
    totalWeekendDays,
    saturdaysCount,
    sundaysCount,
    otherExcludedDaysCount,
    totalHolidaysExcluded,
    holidaysInRange,
    workingWeeks,
    workingDaysRemainder,
    estimatedWorkingHours,
    workingDayPercentage,
    dayDetails,
    isReversed,
    actualStartDate: actualStart,
    actualEndDate: actualEnd,
  };
}

export function calculateAddSubtractDays(settings: AddSubtractSettings): AddSubtractResult {
  const {
    startDate,
    operation,
    amount,
    countingType,
    includeStartDate,
    excludedDaysOfWeek,
    excludeHolidays,
    country,
    customHolidays,
  } = settings;

  const start = parseDateString(startDate);
  const step = operation === 'add' ? 1 : -1;
  const targetUnits = Math.max(0, amount);

  // We build a wide holidays map around the date
  const baseYear = start.getFullYear();
  const holidaysMap = excludeHolidays
    ? buildHolidaysMap(country, baseYear - 2, baseYear + 5, customHolidays)
    : new Map<string, Holiday>();

  let unitsCounted = 0;
  let totalCalendarDaysSpanned = 0;
  let totalWorkingDaysSpanned = 0;
  let totalWeekendDaysSpanned = 0;
  let totalHolidaysSpanned = 0;
  const holidaysList: Holiday[] = [];

  const current = new Date(start.getTime());

  // Check if start date itself is counted towards the required amount
  if (includeStartDate && targetUnits > 0) {
    const dateStr = formatDateString(current);
    const dayOfWeek = current.getDay() as DayOfWeek;
    const isWeekend = isWeekendDay(dayOfWeek, excludedDaysOfWeek);
    const holidayInfo = excludeHolidays ? holidaysMap.get(dateStr) : undefined;
    const isHoliday = Boolean(holidayInfo);

    if (countingType === 'calendar') {
      unitsCounted++;
      totalCalendarDaysSpanned++;
      if (isWeekend) totalWeekendDaysSpanned++;
      else if (isHoliday) totalHolidaysSpanned++;
      else totalWorkingDaysSpanned++;
    } else {
      // working days
      if (!isWeekend && !isHoliday) {
        unitsCounted++;
        totalWorkingDaysSpanned++;
      } else if (isWeekend) {
        totalWeekendDaysSpanned++;
      } else if (isHoliday) {
        totalHolidaysSpanned++;
      }
      totalCalendarDaysSpanned++;
    }

    if (isHoliday && holidayInfo) {
      holidaysList.push(holidayInfo);
    }
  }

  // Iterate until unitsCounted reaches targetUnits
  while (unitsCounted < targetUnits) {
    current.setDate(current.getDate() + step);
    const dateStr = formatDateString(current);
    const dayOfWeek = current.getDay() as DayOfWeek;
    const isWeekend = isWeekendDay(dayOfWeek, excludedDaysOfWeek);
    const holidayInfo = excludeHolidays ? holidaysMap.get(dateStr) : undefined;
    const isHoliday = Boolean(holidayInfo);

    totalCalendarDaysSpanned++;

    if (countingType === 'calendar') {
      unitsCounted++;
      if (isWeekend) totalWeekendDaysSpanned++;
      else if (isHoliday) totalHolidaysSpanned++;
      else totalWorkingDaysSpanned++;
    } else {
      // business days
      if (!isWeekend && !isHoliday) {
        unitsCounted++;
        totalWorkingDaysSpanned++;
      } else if (isWeekend) {
        totalWeekendDaysSpanned++;
      } else if (isHoliday) {
        totalHolidaysSpanned++;
      }
    }

    if (isHoliday && holidayInfo && !holidaysList.some(h => h.date === holidayInfo.date)) {
      holidaysList.push(holidayInfo);
    }
  }

  const finalDateStr = formatDateString(current);
  const finalDayOfWeek = current.getDay();

  return {
    targetDate: finalDateStr,
    targetDayOfWeekName: DAY_NAMES[finalDayOfWeek],
    totalCalendarDaysSpanned,
    totalWorkingDaysSpanned,
    totalWeekendDaysSpanned,
    totalHolidaysSpanned,
    holidaysList,
  };
}

// Preset Helpers
export function getPresetDateRange(preset: string): { start: string; end: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth(); // 0-based
  const d = now.getDate();

  switch (preset) {
    case 'today_plus_10_biz': {
      const start = formatDateString(now);
      const res = calculateAddSubtractDays({
        startDate: start,
        operation: 'add',
        amount: 10,
        countingType: 'working',
        includeStartDate: false,
        excludedDaysOfWeek: [0, 6],
        excludeHolidays: false,
        country: 'NONE',
        customHolidays: [],
        hoursPerDay: 8,
      });
      return { start, end: res.targetDate };
    }
    case 'today_plus_30_biz': {
      const start = formatDateString(now);
      const res = calculateAddSubtractDays({
        startDate: start,
        operation: 'add',
        amount: 30,
        countingType: 'working',
        includeStartDate: false,
        excludedDaysOfWeek: [0, 6],
        excludeHolidays: false,
        country: 'NONE',
        customHolidays: [],
        hoursPerDay: 8,
      });
      return { start, end: res.targetDate };
    }
    case 'this_month': {
      const first = new Date(y, m, 1);
      const last = new Date(y, m + 1, 0);
      return { start: formatDateString(first), end: formatDateString(last) };
    }
    case 'next_month': {
      const first = new Date(y, m + 1, 1);
      const last = new Date(y, m + 2, 0);
      return { start: formatDateString(first), end: formatDateString(last) };
    }
    case 'this_quarter': {
      const q = Math.floor(m / 3);
      const first = new Date(y, q * 3, 1);
      const last = new Date(y, (q + 1) * 3, 0);
      return { start: formatDateString(first), end: formatDateString(last) };
    }
    case 'next_two_weeks': {
      const start = formatDateString(now);
      const target = new Date(now.getTime());
      target.setDate(target.getDate() + 14);
      return { start, end: formatDateString(target) };
    }
    case 'full_year': {
      return { start: `${y}-01-01`, end: `${y}-12-31` };
    }
    case 'year_to_date': {
      return { start: `${y}-01-01`, end: formatDateString(now) };
    }
    default:
      return { start: formatDateString(now), end: addDays(formatDateString(now), 14) };
  }
}
