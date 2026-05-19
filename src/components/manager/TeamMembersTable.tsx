"use client";

import { Profile } from "@/lib/types";
import { Trash, ShieldCheck, User, DotsThreeVertical } from "phosphor-react";
import { format, parseISO } from "date-fns";
import { useState } from "react";

export default function TeamMembersTable({
  members,
  lastSubmissions,
  onPromote,
  onRemove,
}: {
  members: Profile[];
  lastSubmissions: Record<string, string | null>;
  onPromote: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  return (
    <div className="card p-0 overflow-hidden bg-white border border-border-gray">
      <div className="px-6 py-4 border-b border-border-gray bg-gray-50/50">
        <h3 className="font-semibold text-text-primary">Team Members</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50/30">
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b">
                Name
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b">
                Email
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b">
                Role
              </th>
              <th className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b">
                Last Standup
              </th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-text-secondary border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-gray">
            {members.map((m) => (
              <tr
                key={m.id}
                className="hover:bg-background-cream transition-colors group"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                    style={{ backgroundColor: m.avatar_color || "#9ca3af" }}
                  >
                    {m.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{m.full_name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {m.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${m.role === "manager" ? "bg-primary-light text-primary-dark" : "bg-gray-100 text-text-secondary"}`}
                  >
                    {m.role === "manager" ? (
                      <ShieldCheck size={12} />
                    ) : (
                      <User size={12} />
                    )}
                    {m.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-secondary">
                  {lastSubmissions[m.id] ? (
                    format(parseISO(lastSubmissions[m.id]!), "MMM do, yyyy")
                  ) : (
                    <span className="text-xs italic text-gray-400">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === m.id ? null : m.id)
                    }
                    className="p-1"
                  >
                    <DotsThreeVertical size={20} />
                  </button>
                  {activeMenu === m.id && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-6 top-12 w-48 bg-white rounded-xl shadow-lg border py-2 z-30">
                        {m.role === "employee" && (
                          <button
                            onClick={() => {
                              onPromote(m.id);
                              setActiveMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-background-cream"
                          >
                            <ShieldCheck size={18} className="text-primary" />{" "}
                            Promote
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onRemove(m.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-danger flex items-center gap-2 hover:bg-rose-50"
                        >
                          <Trash size={18} /> Remove
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
