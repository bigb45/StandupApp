"use client";

import { Profile, Standup, Mood } from "@/lib/types";
import { format, subDays, parseISO } from "date-fns";
import {
  Smiley,
  SmileyMeh,
  SmileySad,
  SmileyWink,
  IconProps,
} from "phosphor-react";
import { useMemo, ComponentType } from "react";

const moodIcons: Record<Mood, ComponentType<IconProps>> = {
  great: SmileyWink,
  good: Smiley,
  meh: SmileyMeh,
  struggling: SmileySad,
};

export default function GridView({
  profiles,
  standups,
  onSelectUser,
}: {
  profiles: Profile[];
  standups: Standup[];
  onSelectUser: (p: Profile, d: string) => void;
}) {
  const dates = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) =>
        format(subDays(new Date(), i), "yyyy-MM-dd"),
      ),
    [],
  );
  return (
    <div className="card p-0 overflow-hidden bg-white border border-border-gray">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 border-b border-r p-4 text-left min-w-[200px] text-xs font-bold uppercase tracking-widest text-text-secondary">
                Employee
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  className="border-b p-4 min-w-[100px] bg-gray-50/50 text-center"
                >
                  <p className="text-[10px] font-bold uppercase text-text-secondary">
                    {format(parseISO(d), "EEE")}
                  </p>
                  <p className="text-sm font-semibold">
                    {format(parseISO(d), "MMM d")}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr
                key={p.id}
                className="hover:bg-background-cream transition-colors group"
              >
                <td className="sticky left-0 bg-white group-hover:bg-background-cream border-b border-r p-4 flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: p.avatar_color || "#9ca3af" }}
                  >
                    {p.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{p.full_name}</span>
                </td>
                {dates.map((d) => {
                  const s = standups.find(
                    (st) => st.user_id === p.id && st.date === d,
                  );
                  const Icon = s?.mood ? moodIcons[s.mood] : null;
                  return (
                    <td key={d} className="border-b p-4 text-center">
                      {s ? (
                        <button
                          onClick={() => onSelectUser(p, d)}
                          className="flex flex-col items-center gap-1"
                        >
                          {(Icon && (
                            <Icon size={20} className="text-primary" />
                          )) ||
                            null}
                          <div
                            className={`h-2 w-2 rounded-full ${s.is_late ? "bg-warning" : "bg-success"}`}
                          />
                        </button>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-gray-200 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border-gray">
        {profiles.map((p) => (
          <div key={p.id} className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ backgroundColor: p.avatar_color || "#9ca3af" }}
              >
                {p.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <span className="text-sm font-medium text-text-primary">
                {p.full_name}
              </span>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {dates.slice(0, 7).map((d) => {
                const s = standups.find(
                  (st) => st.user_id === p.id && st.date === d,
                );
                const Icon = s?.mood ? moodIcons[s.mood] : null;
                return (
                  <button
                    key={d}
                    onClick={() => s && onSelectUser(p, d)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-gray-50/50"
                  >
                    <p className="text-[10px] font-bold text-text-secondary uppercase">
                      {format(parseISO(d), "EEE")}
                    </p>
                    {s ? (
                      <>
                        {Icon && <Icon size={18} className="text-primary" />}
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${s.is_late ? "bg-warning" : "bg-success"}`}
                        />
                      </>
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-gray-200" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
