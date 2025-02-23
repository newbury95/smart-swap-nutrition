
import React from 'react';
import { Calendar } from "@/components/ui/calendar";
import { DailySummary } from "@/components/diary/DailySummary";

interface DiarySidebarProps {
  date: Date;
  onSelectDate: (date: Date | undefined) => void;
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const DiarySidebar: React.FC<DiarySidebarProps> = ({
  date,
  onSelectDate,
  dailyTotals,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          className="rounded-md"
        />
      </div>
      <DailySummary dailyTotals={dailyTotals} />
    </div>
  );
};
