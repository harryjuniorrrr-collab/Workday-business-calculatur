export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

export type CalculatorMode = 'between_dates' | 'add_subtract';

export interface Holiday {
  date: string; // YYYY-MM-DD
  name: string;
  country?: string;
  isCustom?: boolean;
}

export type CountryCode = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR' | 'NONE';

export interface DateRangeSettings {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  includeStartDate: boolean;
  includeEndDate: boolean;
  excludedDaysOfWeek: DayOfWeek[]; // [0, 6] for Sat & Sun
  excludeHolidays: boolean;
  country: CountryCode;
  customHolidays: Holiday[];
  hoursPerDay: number;
}

export interface DayDetail {
  date: string; // YYYY-MM-DD
  dayOfWeek: DayOfWeek;
  dayName: string;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayName?: string;
  isWorkingDay: boolean;
  isStartOrEnd?: 'start' | 'end' | 'both';
}

export interface CalculationResult {
  totalCalendarDays: number;
  totalWorkingDays: number;
  totalWeekendDays: number;
  saturdaysCount: number;
  sundaysCount: number;
  otherExcludedDaysCount: number;
  totalHolidaysExcluded: number;
  holidaysInRange: Holiday[];
  workingWeeks: number;
  workingDaysRemainder: number;
  estimatedWorkingHours: number;
  workingDayPercentage: number;
  dayDetails: DayDetail[];
  isReversed: boolean;
  actualStartDate: string;
  actualEndDate: string;
}

export interface AddSubtractSettings {
  startDate: string; // YYYY-MM-DD
  operation: 'add' | 'subtract';
  amount: number;
  countingType: 'working' | 'calendar';
  includeStartDate: boolean;
  excludedDaysOfWeek: DayOfWeek[];
  excludeHolidays: boolean;
  country: CountryCode;
  customHolidays: Holiday[];
  hoursPerDay: number;
}

export interface AddSubtractResult {
  targetDate: string; // YYYY-MM-DD
  targetDayOfWeekName: string;
  totalCalendarDaysSpanned: number;
  totalWorkingDaysSpanned: number;
  totalWeekendDaysSpanned: number;
  totalHolidaysSpanned: number;
  holidaysList: Holiday[];
}
