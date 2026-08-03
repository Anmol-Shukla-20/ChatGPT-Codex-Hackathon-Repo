import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Upload, Workflow } from "lucide-react";
import { SiteShell } from "@/components/layouts/site-shell";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { Logo } from "@/components/ui/logo";

const features = [
  {
    icon: Upload,
    title: "Single document upload",
    description: "Create a citizen profile once and reuse it for future scheme discovery.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted eligibility discovery",
    description: "Surface relevant government benefits with a guided, understandable experience.",
  },
  {
    icon: ShieldCheck,
    title: "Trust-first design",
    description: "Built to support clear, accessible, and confidence-building journeys.",
  },
];

const steps = [
  "Upload your documents securely.",
  "Build a reusable digital citizen profile.",
  "Discover schemes you may be eligible for.",
  "Take the next step with confidence.",
];

const benefits = [
  "Simple, citizen-friendly workflows",
  "Consistent responsive experience",
  "Reusable foundation for future product modules",
  "Accessible, production-oriented UI patterns",
];

export default function LandingPage() {
  return (
    <SiteShell>
      <PageHeader
        title="BharatSetu AI"
        description="Your AI Gateway to Government Benefits"
        breadcrumbs={[{ label: "Home" }]}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        }
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1 text-sm text-muted-foreground">
            <Logo />
          </div>
          <div className="space-y-4">
            <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              BharatSetu AI
            </h2>
            <p className="text-lg font-medium text-primary sm:text-xl">
              Your AI Gateway to Government Benefits
            </p>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Upload your documents once, build your digital citizen profile, and discover government schemes you are
              eligible for with AI assistance.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatsCard label="Document-first" value="1x" helper="Upload once" />
            <StatsCard label="Journey" value="Fast" helper="Clear next steps" />
            <StatsCard label="Experience" value="Responsive" helper="Mobile ready" />
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Citizen profile</p>
              <div className="mt-3 space-y-2">
                <div className="h-3 w-3/4 rounded-full bg-foreground/10" />
                <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
                <div className="h-3 w-5/6 rounded-full bg-foreground/10" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-medium">Eligibility Match</p>
                <p className="mt-1 text-2xl font-semibold">12</p>
              </div>
              <div className="rounded-2xl border p-4">
                <p className="text-sm font-medium">Workflow</p>
                <p className="mt-1 text-2xl font-semibold">Guided</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="features" className="mt-14">
        <Section title="Features" description="A focused set of capabilities for citizen-facing discovery journeys.">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.title} className="rounded-2xl border bg-background p-5">
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <div id="how-it-works" className="mt-8">
        <Section title="How BharatSetu Works" description="A simple flow that keeps the experience understandable and low-friction.">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step} className="rounded-2xl border bg-background p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                  {index + 1}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div id="why-bharatsetu" className="mt-8">
        <Section title="Why BharatSetu AI" description="Built to support scale, trust, and future expansion.">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <p className="text-sm leading-6">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border bg-muted/30 p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Designed for</p>
              <p className="mt-3 text-2xl font-semibold">A production-ready citizen experience</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                BharatSetu AI provides a clean foundation for growing from landing page to full product workflows
                without rethinking the front-end structure.
              </p>
            </div>
          </div>
        </Section>
      </div>

      <section className="mt-8 rounded-3xl border bg-primary px-6 py-10 text-primary-foreground shadow-sm sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary-foreground/80">
              <Workflow className="h-4 w-4" />
              Ready to begin
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Start building a better citizen journey today.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="mt-10 border-t pt-6">
        <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BharatSetu AI. All rights reserved.</p>
          <p>Built for scalable, accessible government benefit discovery.</p>
        </div>
      </footer>
    </SiteShell>
  );
}
