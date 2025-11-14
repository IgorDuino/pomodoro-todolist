"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns";

interface DayNavigationProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function DayNavigation({ currentDate, onDateChange }: DayNavigationProps) {
  const handlePrevDay = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDateLabel = () => {
    if (isToday(currentDate)) return "Today";
    if (isTomorrow(currentDate)) return "Tomorrow";
    if (isYesterday(currentDate)) return "Yesterday";
    return format(currentDate, "EEEE, MMMM d");
  };

  return (
    <div className="flex items-center gap-4 flex-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevDay}
        className="h-9 w-9"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-3 flex-1 justify-center">
        <h2 className="text-xl font-semibold">{getDateLabel()}</h2>
        {!isToday(currentDate) && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="h-7 px-2 text-xs"
          >
            Today
          </Button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNextDay}
        className="h-9 w-9"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
