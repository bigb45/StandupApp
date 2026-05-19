"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mood, Standup, Profile } from "@/lib/types";
import StandupForm from "@/components/dashboard/StandupForm";
import SubmittedStandup from "@/components/dashboard/SubmittedStandup";
import PastStandupCard from "@/components/dashboard/PastStandupCard";
import GhostStandupCard from "@/components/dashboard/GhostStandupCard";
import toast from "react-hot-toast";
import { format, subDays, parseISO } from "date-fns";
import { ClockCounterClockwise } from "phosphor-react";

export default function DashboardPage() {
  const [todayContent, setTodayContent] = useState("");
  const [tomorrowContent, setTomorrowContent] = useState("");
  const [blockersContent, setBlockersContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingStandup, setExistingStandup] = useState<Standup | null>(null);
  const [pastStandups, setPastStandups] = useState<Standup[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isRetroactive, setIsRetroactive] = useState(false);
  const [retroDate, setRetroDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const supabase = createClient();
  const todayDate = format(new Date(), "yyyy-MM-dd");

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setUserProfile(profile);

        const { data: todayData } = await supabase
          .from("standups")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", todayDate)
          .single();
        if (todayData) {
          setExistingStandup(todayData);
          setTodayContent(todayData.today || "");
          setTomorrowContent(todayData.tomorrow || "");
          setBlockersContent(todayData.blockers || "");
          setMood(todayData.mood);
        }

        const thirtyDaysAgo = format(subDays(new Date(), 30), "yyyy-MM-dd");
        const { data: pastData } = await supabase
          .from("standups")
          .select("*")
          .eq("user_id", user.id)
          .lt("date", todayDate)
          .gte("date", thirtyDaysAgo)
          .order("date", { ascending: false });
        if (pastData) setPastStandups(pastData);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [supabase, todayDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood || !userProfile) {
      toast.error("Please select mood");
      return;
    }
    setIsSubmitting(true);

    const targetDate = isRetroactive ? retroDate : todayDate;
    const standupData = {
      user_id: userProfile.id,
      date: targetDate,
      today: todayContent,
      tomorrow: tomorrowContent,
      blockers: blockersContent,
      mood,
      is_late: isRetroactive,
    };

    let result;
    if (existingStandup && !isRetroactive) {
      result = await supabase
        .from("standups")
        .update(standupData)
        .eq("id", existingStandup.id)
        .select();
    } else {
      result = await supabase.from("standups").insert(standupData).select();
    }

    if (result.error) {
      toast.error(result.error.message);
    } else {
      const standupId = result.data?.[0]?.id;

      if (standupId) {
        // Parse mentions and save to mentions table
        const mentionMatches = blockersContent.match(
          /@([\p{L}\p{M}'\-]+\s+[\p{L}\p{M}'\-]+)/gu,
        );
        if (mentionMatches) {
          const { data: allProfiles } = await supabase
            .from("profiles")
            .select("id, full_name");

          const mentionInserts = mentionMatches
            .map((match) => {
              const name = match.substring(1);
              const profile = allProfiles?.find((p) => p.full_name === name);
              if (profile) {
                return {
                  standup_id: standupId,
                  mentioning_user_id: userProfile.id,
                  mentioned_user_id: profile.id,
                };
              }
              return null;
            })
            .filter((m) => m !== null);

          await supabase.from("mentions").delete().eq("standup_id", standupId);
          if (mentionInserts.length > 0) {
            await supabase.from("mentions").insert(mentionInserts);
          }
        } else {
          await supabase.from("mentions").delete().eq("standup_id", standupId);
        }
      }

      toast.success("Submitted");
      const { data: todayData } = await supabase
        .from("standups")
        .select("*")
        .eq("user_id", userProfile.id)
        .eq("date", todayDate)
        .single();
      setExistingStandup(todayData);

      const { data: pastData } = await supabase
        .from("standups")
        .select("*")
        .eq("user_id", userProfile.id)
        .lt("date", todayDate)
        .order("date", { ascending: false });
      setPastStandups(pastData || []);

      setIsEditMode(false);
      setIsRetroactive(false);
      setRetroDate(null);
    }
    setIsSubmitting(false);
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 animate-pulse rounded-xl" />
        <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  const last7Days = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), i + 1), "yyyy-MM-dd"),
  );

  return (
    <div className="space-y-12">
      <section>
        {isRetroactive && (
          <div className="mb-4 flex items-center justify-between bg-warning/10 border border-warning/20 p-4 rounded-xl">
            <p className="text-sm font-medium text-amber-700">
              Filling standup for{" "}
              {format(parseISO(retroDate!), "MMMM do, yyyy")}
            </p>
            <button
              onClick={() => {
                setIsRetroactive(false);
                setRetroDate(null);
              }}
              className="text-xs font-bold text-amber-700 hover:underline"
            >
              Cancel
            </button>
          </div>
        )}
        {existingStandup && !isEditMode && !isRetroactive ? (
          <SubmittedStandup
            standup={existingStandup}
            onEdit={() => setIsEditMode(true)}
          />
        ) : (
          <StandupForm
            today={todayContent}
            tomorrow={tomorrowContent}
            blockers={blockersContent}
            mood={mood}
            setToday={setTodayContent}
            setTomorrow={setTomorrowContent}
            setBlockers={setBlockersContent}
            setMood={setMood}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditMode={isEditMode}
          />
        )}
      </section>
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-border-gray pb-2">
          <ClockCounterClockwise size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">
            Past Standups
          </h3>
        </div>
        <div className="space-y-4">
          {last7Days.map(
            (d) =>
              !pastStandups.some((s) => s.date === d) && (
                <GhostStandupCard
                  key={d}
                  date={d}
                  onFill={(d) => {
                    setRetroDate(d);
                    setIsRetroactive(true);
                    setTodayContent("");
                    setTomorrowContent("");
                    setBlockersContent("");
                    setMood(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              ),
          )}
          {pastStandups.map((s) => (
            <PastStandupCard key={s.id} standup={s} />
          ))}
        </div>
      </section>
    </div>
  );
}
