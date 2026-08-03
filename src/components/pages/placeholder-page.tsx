import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { StatsCard } from "@/components/ui/stats-card";

export function PlaceholderPage({ title, description }: Readonly<{ title: string; description: string }>) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumbs={[{ label: "Home", href: "/" }, { label: title }]} />
      <Section title={`${title} overview`} description="Placeholder content for future feature work.">
        <div className="grid gap-4 md:grid-cols-3">
          <StatsCard label="Metric" value="--" helper="Placeholder" />
          <StatsCard label="Status" value="Ready" helper="UI shell" />
          <StatsCard label="Access" value="Responsive" helper="Mobile first" />
        </div>
      </Section>
    </div>
  );
}
