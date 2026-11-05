import React from 'react';
import { HelpCircle, Clock, Calendar, CheckCircle2 } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'What is the difference between working days and calendar days?',
      a: 'Calendar days include all 7 days of the week consecutively (Monday through Sunday) regardless of weekends or official holidays. Working days (also called business days) only count regular business operating days—typically excluding Saturdays, Sundays, and official public bank/federal holidays.',
    },
    {
      q: 'When should I include or exclude the end date?',
      a: 'If a project or leave runs "from May 1 through May 10 inclusive", you should include both the start and end dates (10 calendar days). If you are measuring duration or SLA time elapsed (e.g., "within 10 days of notification"), standard practice excludes the start date and counts elapsed days ending on the target date.',
    },
    {
      q: 'How does this calculator avoid double-counting holidays on weekends?',
      a: 'If a recognized public holiday falls on a Saturday or Sunday, our calculation engine ensures it is not deducted twice. A non-working weekend day is counted once under Weekend Days, preserving total mathematical integrity.',
    },
    {
      q: 'Can I calculate for countries with different weekend days (e.g. Sunday-Thursday)?',
      a: 'Yes! In the weekend selector, simply select the "Fri & Sat" preset or toggle specific days. Countries in the Middle East / Gulf region often operate on Sunday-Thursday schedules, and many manufacturing plants operate on 6-day (Monday-Saturday) schedules.',
    },
    {
      q: 'How are estimated working hours calculated?',
      a: 'Working hours are derived by multiplying the calculated working days by the standard daily business hours (default is 8 hours, customizable to 7h, 7.5h, 8.5h, 9h, or 10h per day).',
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Business Rules & Calculation Guide</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Everything you need to know about standard business days, SLAs, and holiday rules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 space-y-2"
          >
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              {faq.q}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
