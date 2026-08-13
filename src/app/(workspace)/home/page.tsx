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

export default async function MemberHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) redirect("/login?next=/home");

  const preferenceResult = await supabase
    .from("user_preferences")
    .select("target_country,target_occupation")
    .eq("id", user.id)
    .maybeSingle();

  const preference =
    (preferenceResult.data as CareerPreferenceRow | null) ?? null;
  const targetCountry = preference?.target_country?.toUpperCase() ?? null;
  const targetOccupation = preference?.target_occupation ?? null;
  return (
    <MemberHomeHub
      targetCountry={targetCountry}
      targetOccupation={targetOccupation}
    />
  );
}
