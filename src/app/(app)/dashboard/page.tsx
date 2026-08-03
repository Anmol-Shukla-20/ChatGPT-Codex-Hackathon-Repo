"use client";

import * as React from "react";
import { Activity, BadgeCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatsCard } from "@/components/ui/stats-card";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useAuth } from "@/features/auth/auth-provider";
import { getLocalActivities, getLocalDocuments, getLocalProfile, saveLocalActivities, saveLocalDocuments, saveLocalProfile } from "@/lib/mvp/fallback-store";
import { getProfile, getProfileCompletion } from "@/lib/mvp/profile-service";
import { listDocuments } from "@/lib/mvp/document-service";
import { getRecommendations } from "@/lib/mvp/recommendation-service";
import type { CitizenProfile, DocumentRecord, RecentActivity, SchemeRecommendation } from "@/lib/mvp/types";

const defaultActivities: RecentActivity[] = [
  {
    id: "welcome",
    title: "Welcome to BharatSetu AI",
    description: "Start by completing your profile and uploading the documents you want to reuse.",
    time: "Just now",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = React.useState<CitizenProfile | null>(null);
  const [documents, setDocuments] = React.useState<DocumentRecord[]>([]);
  const [recommendations, setRecommendations] = React.useState<SchemeRecommendation[]>([]);
  const [activities, setActivities] = React.useState<RecentActivity[]>(defaultActivities);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const storedProfile = getLocalProfile<CitizenProfile | null>(null);
        const storedDocuments = getLocalDocuments<DocumentRecord[]>([]);
        const storedActivities = getLocalActivities<RecentActivity[]>(defaultActivities);

        setProfile(storedProfile);
        setDocuments(storedDocuments);
        setActivities(storedActivities.length ? storedActivities : defaultActivities);

        if (user?.id) {
          const [remoteProfile, remoteDocuments] = await Promise.all([
            getProfile(user.id).catch(() => null),
            listDocuments(user.id).catch(() => []),
          ]);

          const resolvedProfile = remoteProfile ?? storedProfile ?? null;
          const resolvedDocuments = remoteDocuments.length ? remoteDocuments : storedDocuments;

          if (resolvedProfile) {
            setProfile(resolvedProfile);
            saveLocalProfile(resolvedProfile);
          }

          if (resolvedDocuments.length) {
            setDocuments(resolvedDocuments);
            saveLocalDocuments(resolvedDocuments);
          }

          const nextRecommendations = await getRecommendations(resolvedProfile, resolvedDocuments);
          setRecommendations(nextRecommendations.slice(0, 3));
          const refreshedActivities = [
            {
              id: `${Date.now()}`,
              title: "Recommendations refreshed",
              description: `${nextRecommendations.length} schemes are ready for review.`,
              time: "Now",
            },
            ...(storedActivities.length ? storedActivities : defaultActivities),
          ].slice(0, 4);
          saveLocalActivities(refreshedActivities);
          setActivities(refreshedActivities);
        } else {
          const nextRecommendations = await getRecommendations(storedProfile, storedDocuments);
          setRecommendations(nextRecommendations.slice(0, 3));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load dashboard.");
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, [user?.id]);

  const completion = React.useMemo(() => getProfileCompletion(profile), [profile]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track your citizen profile, upload status, and personalized scheme recommendations."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]}
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Profile completion" value={`${completion}%`} helper="Keep improving your profile" />
          <StatsCard label="Recommended schemes" value={`${recommendations.length}`} helper="Personalized matches" />
          <StatsCard label="Documents on file" value={`${documents.length}`} helper="Ready for review" />
        </div>
      )}

      <Section title="Profile status" description="Your current eligibility readiness and data quality.">
        <div className="rounded-2xl border bg-background p-5">
          <p className="text-sm text-muted-foreground">Completion status</p>
          <p className="mt-2 text-3xl font-semibold">{completion}%</p>
          <p className="mt-2 text-sm text-muted-foreground">{completion > 70 ? "Your profile is strong enough to receive tailored recommendations." : "Add a few more details to improve your matching quality."}</p>
        </div>
      </Section>

      <Section title="Recommended schemes" description="Your most relevant opportunities based on the profile you shared.">
        {recommendations.length ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {recommendations.map((scheme) => (
              <div key={scheme.id} className="rounded-2xl border bg-background p-5">
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Sparkles className="h-4 w-4" />
                  <span>{scheme.eligibility_score}% match</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{scheme.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{scheme.reason}</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <BadgeCheck className="h-4 w-4" />
                  <span>{scheme.required_documents.length} key documents</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No schemes yet" description="Complete your profile to unlock recommendations for the right benefit programs." />
        )}
      </Section>

      <Section title="Activity timeline" description="Recent updates from your BharatSetu AI workflow.">
        {activities.length ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No activity yet" description="Your latest profile and document actions will appear here." />
        )}
      </Section>
    </div>
  );
}
