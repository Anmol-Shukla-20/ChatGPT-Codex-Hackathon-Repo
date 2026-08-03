"use client";

import * as React from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatsCard } from "@/components/ui/stats-card";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { getLocalProfile, saveLocalProfile } from "@/lib/mvp/fallback-store";
import { districtMap, indianStatesAndUTs } from "@/lib/mvp/geography";
import { getProfile, getProfileCompletion, saveProfile, validateProfile } from "@/lib/mvp/profile-service";
import type { CitizenProfile } from "@/lib/mvp/types";

const initialProfile: CitizenProfile = {
  name: "",
  age: "",
  gender: "",
  state: "",
  district: "",
  occupation: "",
  annual_income: "",
  category: "",
  disability: "",
  education: "",
  family_size: "",
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<CitizenProfile>(initialProfile);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [showOccupationOther, setShowOccupationOther] = React.useState(false);

  React.useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const storedProfile = getLocalProfile<CitizenProfile | null>(null);
      if (storedProfile) {
        setProfile(storedProfile);
      }

      if (user?.id) {
        try {
          const remoteProfile = await getProfile(user.id);
          if (remoteProfile) {
            setProfile(remoteProfile);
            saveLocalProfile(remoteProfile);
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Unable to load profile.");
        }
      }

      setLoading(false);
    }

    void loadProfile();
  }, [user?.id]);

  const completion = React.useMemo(() => getProfileCompletion(profile), [profile]);

  React.useEffect(() => {
    setShowOccupationOther(String(profile.occupation).trim().toLowerCase() === "other");
  }, [profile.occupation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const normalized = validateProfile(profile);
      setProfile(normalized);

      if (user?.id) {
        const savedProfile = await saveProfile(user.id, normalized);
        if (savedProfile) {
          setProfile(savedProfile);
          saveLocalProfile(savedProfile);
        }
      } else {
        saveLocalProfile(normalized);
      }

      toast.success("Citizen profile saved successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Citizen profile"
        description="Capture the information that powers your personalized eligibility checks."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Completion" value={`${completion}%`} helper="Use the form below to improve it" />
          <StatsCard label="Status" value={completion === 100 ? "Complete" : "In progress"} helper="Profile is synced locally and with Supabase" />
          <StatsCard label="Mode" value={user?.id ? "Live" : "Local"} helper="Authenticated users sync to Supabase" />
        </div>
      )}

      <Section title="Profile details" description="These values help the eligibility engine personalize the journey.">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              <span>Name</span>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.name ?? ""} onChange={(event) => setProfile({ ...profile, name: event.target.value })} required />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Age</span>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" type="number" value={profile.age ?? ""} onChange={(event) => setProfile({ ...profile, age: event.target.value })} required />
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Gender</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.gender ?? ""} onChange={(event) => setProfile({ ...profile, gender: event.target.value })} required>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>State</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.state ?? ""} onChange={(event) => setProfile({ ...profile, state: event.target.value, district: "" })} required>
                <option value="">Select</option>
                {indianStatesAndUTs.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>District</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.district ?? ""} onChange={(event) => setProfile({ ...profile, district: event.target.value })} required disabled={!profile.state}>
                <option value="">Select</option>
                {(districtMap[profile.state ?? ""] ?? []).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Occupation</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.occupation ?? ""} onChange={(event) => {
                const nextValue = event.target.value;
                setProfile({ ...profile, occupation: nextValue });
                setShowOccupationOther(nextValue === "Other");
              }} required>
                <option value="">Select</option>
                <option value="Student">Student</option>
                <option value="Employee">Employee</option>
                <option value="Self Employed">Self Employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Senior Citizen">Senior Citizen</option>
                <option value="Teacher">Teacher</option>
                <option value="Engineer">Engineer</option>
                <option value="Farmer">Farmer</option>
                <option value="Other">Other</option>
              </select>
            </label>
            {showOccupationOther ? (
              <label className="space-y-2 text-sm font-medium md:col-span-2">
                <span>Other occupation</span>
                <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.occupation === "Other" ? "" : String(profile.occupation ?? "")} onChange={(event) => setProfile({ ...profile, occupation: event.target.value })} placeholder="Describe your occupation" />
              </label>
            ) : null}
            <label className="space-y-2 text-sm font-medium">
              <span>Annual income</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={String(profile.annual_income ?? "")} onChange={(event) => setProfile({ ...profile, annual_income: event.target.value })} required>
                <option value="">Select</option>
                <option value="100000">Below ₹1 Lakh</option>
                <option value="400000">₹1–4 Lakh</option>
                <option value="600000">₹4–6 Lakh</option>
                <option value="800000">₹6–8 Lakh</option>
                <option value="1000000">Above ₹8 Lakh</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Category</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.category ?? ""} onChange={(event) => setProfile({ ...profile, category: event.target.value })} required>
                <option value="">Select</option>
                <option value="General">General</option>
                <option value="EWS">EWS</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Disability</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.disability ?? ""} onChange={(event) => setProfile({ ...profile, disability: event.target.value })} required>
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Education</span>
              <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={profile.education ?? ""} onChange={(event) => setProfile({ ...profile, education: event.target.value })} required>
                <option value="">Select</option>
                <option value="School">School</option>
                <option value="Higher secondary">Higher secondary</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium">
              <span>Family size</span>
              <input className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" type="number" value={profile.family_size ?? ""} onChange={(event) => setProfile({ ...profile, family_size: event.target.value })} required />
            </label>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save profile"}
          </Button>
        </form>
      </Section>
    </div>
  );
}
