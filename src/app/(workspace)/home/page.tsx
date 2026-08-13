import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CareerOnboardingReturnBridge } from "@/components/onboarding/career-onboarding-return";
import { createClient } from "@/lib/supabase-server";
import { MemberHomeHub } from "./member-home-hub";
import { SavedCareerResultsSection, type SavedCareerResultSummary } from "./saved-career-results-section";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore countries, visas, jobs, programs and institutions from one career workspace.",
  robots: { index: false, follow: false },
};

type CareerPreferenceRow = {
  target_country: string | null;
  target_occupation: string | null;
};

export default async function MemberHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) redirect("/login?next=/home");

  const [preferenceResult, savedCareerResult] = await Promise.all([
    supabase
      .from("user_preferences")
      .select("target_country,target_occupation")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("saved_career_results")
      .select("country_code,career_id,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const preference =
    (preferenceResult.data as CareerPreferenceRow | null) ?? null;
  const savedCareerResults =
    (savedCareerResult.data as SavedCareerResultSummary[] | null) ?? [];
  const targetCountry = preference?.target_country?.toUpperCase() ?? null;
  const targetOccupation = preference?.target_occupation ?? null;
  return (
    <>
      <CareerOnboardingReturnBridge />
      <SavedCareerResultsSection rows={savedCareerResults} />
      <MemberHomeHub
        targetCountry={targetCountry}
        targetOccupation={targetOccupation}
      />
    </>
  );
}
