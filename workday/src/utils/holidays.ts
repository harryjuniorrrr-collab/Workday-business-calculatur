import { CountryCode, Holiday } from '../types/calculator';

// Helper to compute Easter Sunday for a given year (Meeus/Jones/Butcher algorithm)
function getEasterSunday(year: number): { month: number; day: number } {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

// Format YYYY-MM-DD
function toDateStr(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// Find Nth occurrence of a weekday in a month (e.g., 3rd Monday)
// dayOfWeek: 0 = Sun, 1 = Mon, ..., 6 = Sat
function getNthWeekdayOfMonth(year: number, month: number, targetDayOfWeek: number, n: number): number {
  const firstDay = new Date(year, month - 1, 1).getDay();
  let day = 1 + ((targetDayOfWeek - firstDay + 7) % 7);
  day += (n - 1) * 7;
  return day;
}

// Find Last occurrence of a weekday in a month (e.g., last Monday in May)
function getLastWeekdayOfMonth(year: number, month: number, targetDayOfWeek: number): number {
  // Days in month
  const lastDate = new Date(year, month, 0).getDate();
  const lastDayOfWeek = new Date(year, month - 1, lastDate).getDay();
  const diff = (lastDayOfWeek - targetDayOfWeek + 7) % 7;
  return lastDate - diff;
}

export function getPublicHolidays(country: CountryCode, startYear: number, endYear: number): Holiday[] {
  if (country === 'NONE') return [];

  const holidays: Holiday[] = [];

  for (let year = startYear; year <= endYear; year++) {
    const easter = getEasterSunday(year);
    const easterDate = new Date(year, easter.month - 1, easter.day);

    const addDays = (base: Date, days: number): { month: number; day: number } => {
      const target = new Date(base.getTime());
      target.setDate(target.getDate() + days);
      return { month: target.getMonth() + 1, day: target.getDate() };
    };

    const goodFriday = addDays(easterDate, -2);
    const easterMonday = addDays(easterDate, 1);
    const ascensionDay = addDays(easterDate, 39);
    const whitMonday = addDays(easterDate, 50);

    if (country === 'US') {
      // US Federal Holidays
      holidays.push({ date: toDateStr(year, 1, 1), name: "New Year's Day", country: 'US' });
      // Martin Luther King Jr. Day (3rd Mon in Jan)
      holidays.push({ date: toDateStr(year, 1, getNthWeekdayOfMonth(year, 1, 1, 3)), name: 'Martin Luther King Jr. Day', country: 'US' });
      // Washington's Birthday / Presidents' Day (3rd Mon in Feb)
      holidays.push({ date: toDateStr(year, 2, getNthWeekdayOfMonth(year, 2, 1, 3)), name: "Presidents' Day", country: 'US' });
      // Memorial Day (Last Mon in May)
      holidays.push({ date: toDateStr(year, 5, getLastWeekdayOfMonth(year, 5, 1)), name: 'Memorial Day', country: 'US' });
      // Juneteenth
      holidays.push({ date: toDateStr(year, 6, 19), name: 'Juneteenth National Independence Day', country: 'US' });
      // Independence Day
      holidays.push({ date: toDateStr(year, 7, 4), name: 'Independence Day', country: 'US' });
      // Labor Day (1st Mon in Sep)
      holidays.push({ date: toDateStr(year, 9, getNthWeekdayOfMonth(year, 9, 1, 1)), name: 'Labor Day', country: 'US' });
      // Columbus / Indigenous Peoples' Day (2nd Mon in Oct)
      holidays.push({ date: toDateStr(year, 10, getNthWeekdayOfMonth(year, 10, 1, 2)), name: 'Columbus Day', country: 'US' });
      // Veterans Day
      holidays.push({ date: toDateStr(year, 11, 11), name: 'Veterans Day', country: 'US' });
      // Thanksgiving Day (4th Thu in Nov)
      holidays.push({ date: toDateStr(year, 11, getNthWeekdayOfMonth(year, 11, 4, 4)), name: 'Thanksgiving Day', country: 'US' });
      // Christmas Day
      holidays.push({ date: toDateStr(year, 12, 25), name: 'Christmas Day', country: 'US' });
    } else if (country === 'UK') {
      // UK Bank Holidays (England & Wales)
      holidays.push({ date: toDateStr(year, 1, 1), name: "New Year's Day", country: 'UK' });
      holidays.push({ date: toDateStr(year, goodFriday.month, goodFriday.day), name: 'Good Friday', country: 'UK' });
      holidays.push({ date: toDateStr(year, easterMonday.month, easterMonday.day), name: 'Easter Monday', country: 'UK' });
      // Early May Bank Holiday (1st Mon in May)
      holidays.push({ date: toDateStr(year, 5, getNthWeekdayOfMonth(year, 5, 1, 1)), name: 'Early May Bank Holiday', country: 'UK' });
      // Spring Bank Holiday (Last Mon in May)
      holidays.push({ date: toDateStr(year, 5, getLastWeekdayOfMonth(year, 5, 1)), name: 'Spring Bank Holiday', country: 'UK' });
      // Summer Bank Holiday (Last Mon in Aug)
      holidays.push({ date: toDateStr(year, 8, getLastWeekdayOfMonth(year, 8, 1)), name: 'Summer Bank Holiday', country: 'UK' });
      holidays.push({ date: toDateStr(year, 12, 25), name: 'Christmas Day', country: 'UK' });
      holidays.push({ date: toDateStr(year, 12, 26), name: 'Boxing Day', country: 'UK' });
    } else if (country === 'CA') {
      // Canada Statutory Holidays
      holidays.push({ date: toDateStr(year, 1, 1), name: "New Year's Day", country: 'CA' });
      holidays.push({ date: toDateStr(year, goodFriday.month, goodFriday.day), name: 'Good Friday', country: 'CA' });
      // Victoria Day (Mon before May 25)
      const vicDay = new Date(year, 4, 24).getDay();
      const vicDate = 24 - ((vicDay - 1 + 7) % 7);
      holidays.push({ date: toDateStr(year, 5, vicDate), name: 'Victoria Day', country: 'CA' });
      holidays.push({ date: toDateStr(year, 7, 1), name: 'Canada Day', country: 'CA' });
      // Civic Holiday (1st Mon in Aug)
      holidays.push({ date: toDateStr(year, 8, getNthWeekdayOfMonth(year, 8, 1, 1)), name: 'Civic Holiday', country: 'CA' });
      // Labour Day (1st Mon in Sep)
      holidays.push({ date: toDateStr(year, 9, getNthWeekdayOfMonth(year, 9, 1, 1)), name: 'Labour Day', country: 'CA' });
      // Truth and Reconciliation
      holidays.push({ date: toDateStr(year, 9, 30), name: 'National Day for Truth and Reconciliation', country: 'CA' });
      // Thanksgiving (2nd Mon in Oct)
      holidays.push({ date: toDateStr(year, 10, getNthWeekdayOfMonth(year, 10, 1, 2)), name: 'Thanksgiving', country: 'CA' });
      holidays.push({ date: toDateStr(year, 11, 11), name: 'Remembrance Day', country: 'CA' });
      holidays.push({ date: toDateStr(year, 12, 25), name: 'Christmas Day', country: 'CA' });
      holidays.push({ date: toDateStr(year, 12, 26), name: 'Boxing Day', country: 'CA' });
    } else if (country === 'AU') {
      // Australia National Holidays
      holidays.push({ date: toDateStr(year, 1, 1), name: "New Year's Day", country: 'AU' });
      holidays.push({ date: toDateStr(year, 1, 26), name: 'Australia Day', country: 'AU' });
      holidays.push({ date: toDateStr(year, goodFriday.month, goodFriday.day), name: 'Good Friday', country: 'AU' });
      holidays.push({ date: toDateStr(year, easterMonday.month, easterMonday.day), name: 'Easter Monday', country: 'AU' });
      holidays.push({ date: toDateStr(year, 4, 25), name: 'ANZAC Day', country: 'AU' });
      // King's Birthday (2nd Mon in June in most states)
      holidays.push({ date: toDateStr(year, 6, getNthWeekdayOfMonth(year, 6, 1, 2)), name: "King's Birthday", country: 'AU' });
      holidays.push({ date: toDateStr(year, 12, 25), name: 'Christmas Day', country: 'AU' });
      holidays.push({ date: toDateStr(year, 12, 26), name: 'Boxing Day', country: 'AU' });
    } else if (country === 'DE') {
      // Germany (Federal Public Holidays)
      holidays.push({ date: toDateStr(year, 1, 1), name: 'Neujahr', country: 'DE' });
      holidays.push({ date: toDateStr(year, goodFriday.month, goodFriday.day), name: 'Karfreitag', country: 'DE' });
      holidays.push({ date: toDateStr(year, easterMonday.month, easterMonday.day), name: 'Ostermontag', country: 'DE' });
      holidays.push({ date: toDateStr(year, 5, 1), name: 'Tag der Arbeit', country: 'DE' });
      holidays.push({ date: toDateStr(year, ascensionDay.month, ascensionDay.day), name: 'Christi Himmelfahrt', country: 'DE' });
      holidays.push({ date: toDateStr(year, whitMonday.month, whitMonday.day), name: 'Pfingstmontag', country: 'DE' });
      holidays.push({ date: toDateStr(year, 10, 3), name: 'Tag der Deutschen Einheit', country: 'DE' });
      holidays.push({ date: toDateStr(year, 12, 25), name: '1. Weihnachtstag', country: 'DE' });
      holidays.push({ date: toDateStr(year, 12, 26), name: '2. Weihnachtstag', country: 'DE' });
    } else if (country === 'FR') {
      // France Public Holidays
      holidays.push({ date: toDateStr(year, 1, 1), name: "Jour de l'An", country: 'FR' });
      holidays.push({ date: toDateStr(year, easterMonday.month, easterMonday.day), name: 'Lundi de Pâques', country: 'FR' });
      holidays.push({ date: toDateStr(year, 5, 1), name: 'Fête du Travail', country: 'FR' });
      holidays.push({ date: toDateStr(year, 5, 8), name: 'Victoire 1945', country: 'FR' });
      holidays.push({ date: toDateStr(year, ascensionDay.month, ascensionDay.day), name: 'Ascension', country: 'FR' });
      holidays.push({ date: toDateStr(year, whitMonday.month, whitMonday.day), name: 'Lundi de Pentecôte', country: 'FR' });
      holidays.push({ date: toDateStr(year, 7, 14), name: 'Fête Nationale', country: 'FR' });
      holidays.push({ date: toDateStr(year, 8, 15), name: 'Assomption', country: 'FR' });
      holidays.push({ date: toDateStr(year, 11, 1), name: 'Toussaint', country: 'FR' });
      holidays.push({ date: toDateStr(year, 11, 11), name: 'Armistice 1918', country: 'FR' });
      holidays.push({ date: toDateStr(year, 12, 25), name: 'Noël', country: 'FR' });
    }
  }

  // Deduplicate and sort
  const map = new Map<string, Holiday>();
  holidays.forEach(h => {
    if (!map.has(h.date)) {
      map.set(h.date, h);
    }
  });

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export const COUNTRY_OPTIONS: { code: CountryCode; label: string; flag: string }[] = [
  { code: 'US', label: 'United States (Federal)', flag: '🇺🇸' },
  { code: 'UK', label: 'United Kingdom (Bank Holidays)', flag: '🇬🇧' },
  { code: 'CA', label: 'Canada (Federal / Stat)', flag: '🇨🇦' },
  { code: 'AU', label: 'Australia (National)', flag: '🇦🇺' },
  { code: 'DE', label: 'Germany (National)', flag: '🇩🇪' },
  { code: 'FR', label: 'France (National)', flag: '🇫🇷' },
  { code: 'NONE', label: 'No Public Holidays', flag: '🌐' },
];
