import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { MemberHomeHub } from "./member-home-hub";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore countries, visas, jobs, programs and institutions from one career workspace.",
  robots: { index: false, follow: false },
};

type CareerPreferenceRow = {
  target_country: string | null;
  target_occupation: string | null;
};

type SavedCareerResultRow = {
  country_code: string;
  occupation_id: string;
  personalised: boolean;
  evidence_checked_at: string | null;
  next_action: "review_registration" | "review_evidence";
  updated_at: string;
};

export default async function MemberHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) redirect("/login?next=/home");

  const [preferenceResult, savedResultsResult] = await Promise.all([
    supabase
      .from("user_preferences")
      .select("target_country,target_occupation")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("saved_career_results")
      .select("country_code,occupation_id,personalised,evidence_checked_at,next_action,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(4),
  ]);

  const preference =
    (preferenceResult.data as CareerPreferenceRow | null) ?? null;
  const targetCountry = preference?.target_country?.toUpperCase() ?? null;
  const targetOccupation = preference?.target_occupation ?? null;
  return (
    <MemberHomeHub
      targetCountry={targetCountry}
      targetOccupation={targetOccupation}
      savedCareerResults={
        savedResultsResult.error
          ? []
          : ((savedResultsResult.data as SavedCareerResultRow[] | null) ?? [])
      }
    />
  );
}
