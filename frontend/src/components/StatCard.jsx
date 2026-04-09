'use client';

import { useEffect, useState } from 'react';










export default function StatCard({ title, value, icon: Icon, trend, delayClass = '' }) {
  // Simple count-up animation for numbers
  const [displayValue, setDisplayValue] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const end = value;
      if (start === end) {
        setDisplayValue(end);
        return;
      }

      const duration = 1000;
      const incrementTime = duration / end * 2;

      const timer = setInterval(() => {
        start += 1;
        setDisplayValue(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  return (
    <div className={`glass-card p-6 animate-fade-in-up ${delayClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-white">
            {displayValue}
          </h3>
          {trend &&
          <p className="text-xs font-medium text-brand mt-2">
              {trend}
            </p>
          }
        </div>
        <div className="p-3 bg-brand/10 rounded-xl border border-brand/20">
          <Icon className="w-6 h-6 text-brand" />
        </div>
      </div>
    </div>);

}