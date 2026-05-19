"use client";

import { Profile, Standup } from "@/lib/types";
import {
  format,
  startOfWeek,
  addDays,
  isSameDay,
  subWeeks,
  addWeeks,
} from "date-fns";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useState, useMemo } from "react";

export default function CalendarView({
  profiles,
  standups,
  onSelectUser,
}: {
  profiles: Profile[];
  standups: Standup[];
  onSelectUser: (p: Profile, d: string) => void;
}) {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const weekDays = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart],
  );
  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-border-gray flex items-center justify-between bg-white">
        <h3 className="font-semibold text-text-primary">
          Week of {format(currentWeekStart, "MMMM do")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
            className="px-3 py-1 text-xs font-medium text-primary bg-primary-light rounded-lg hover:bg-primary/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
            className="p-1"
          >
            <CaretLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
            className="p-1"
          >
            <CaretRight size={20} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 divide-x divide-border-gray bg-gray-50/30">
        {weekDays.map((day) => {
          const dayStr = format(day, "yyyy-MM-dd");
          const isToday = isSameDay(day, new Date());
          return (
            <div key={dayStr} className="min-h-[400px] flex flex-col">
              <div
                className={`px-4 py-3 border-b border-border-gray text-center ${isToday ? "bg-primary-light/30" : ""}`}
              >
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  {format(day, "EEE")}
                </p>
                <p className="text-sm font-semibold">{format(day, "MMM d")}</p>
              </div>
              <div className="flex-1 p-4 space-y-3">
                {profiles.map((profile) => {
                  const standup = standups.find(
                    (s) => s.user_id === profile.id && s.date === dayStr,
                  );
                  return (
                    <button
                      key={profile.id}
                      onClick={() => standup && onSelectUser(profile, dayStr)}
                      className={`w-full relative flex items-center justify-center p-1 rounded-full ${standup ? "cursor-pointer hover:ring-2 hover:ring-primary/50" : "opacity-30 grayscale cursor-default"}`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{
                          backgroundColor: profile.avatar_color || "#9ca3af",
                        }}
                      >
                        {profile.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      {standup?.is_late && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-warning border-2 border-white rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
