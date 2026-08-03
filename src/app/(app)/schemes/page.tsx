"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { getLocalDocuments, getLocalProfile } from "@/lib/mvp/fallback-store";
import { indianStatesAndUTs } from "@/lib/mvp/geography";
import { getRecommendations } from "@/lib/mvp/recommendation-service";
import type { CitizenProfile, DocumentRecord, SchemeRecommendation } from "@/lib/mvp/types";

export default function SchemesPage() {
  const [search, setSearch] = React.useState("");
  const [stateFilter, setStateFilter] = React.useState("All");
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [schemeTypeFilter, setSchemeTypeFilter] = React.useState("All");
  const [genderFilter, setGenderFilter] = React.useState("All");
  const [occupationFilter, setOccupationFilter] = React.useState("All");
  const [educationFilter, setEducationFilter] = React.useState("All");
  const [incomeFilter, setIncomeFilter] = React.useState("All");
  const [disabilityFilter, setDisabilityFilter] = React.useState("All");
  const [ministryFilter, setMinistryFilter] = React.useState("All");
  const [loading, setLoading] = React.useState(true);
  const [recommendations, setRecommendations] = React.useState<SchemeRecommendation[]>([]);
  const [selectedScheme, setSelectedScheme] = React.useState<SchemeRecommendation | null>(null);

  React.useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      try {
        const profile = getLocalProfile<CitizenProfile | null>(null);
        const documents = getLocalDocuments<DocumentRecord[]>([]);
        const nextRecommendations = await getRecommendations(profile, documents);
        setRecommendations(nextRecommendations);
        setSelectedScheme(nextRecommendations[0] ?? null);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to load recommendations.");
      } finally {
        setLoading(false);
      }
    }

    void loadRecommendations();
  }, []);

  const filteredSchemes = React.useMemo(() => {
    const query = search.toLowerCase();
    return recommendations.filter((scheme) => {
      const hay = `${scheme.title} ${scheme.reason} ${scheme.category} ${scheme.eligibility_rules ?? ""} ${scheme.state ?? ""} ${scheme.tags?.join(" ") ?? ""}`.toLowerCase();
      const matchesSearch = query === "" || hay.includes(query);
      const matchesState = stateFilter === "All" || scheme.state === stateFilter || scheme.state === undefined || scheme.state === "All";
      const matchesCategory = categoryFilter === "All" || scheme.category === categoryFilter;
      const matchesType = schemeTypeFilter === "All" || scheme.level === schemeTypeFilter;
      const matchesGender = genderFilter === "All" || (scheme.eligibility_rules ?? "").toLowerCase().includes(genderFilter.toLowerCase());
      const matchesOccupation = occupationFilter === "All" || hay.includes(occupationFilter.toLowerCase());
      const matchesEducation = educationFilter === "All" || hay.includes(educationFilter.toLowerCase());
      const matchesIncome = incomeFilter === "All" || (scheme.eligibility_rules ?? "").toLowerCase().includes(incomeFilter.replace(/\s/g, "").toLowerCase());
      const matchesDisability = disabilityFilter === "All" || (disabilityFilter === "Yes" ? (scheme.eligibility?.disabilityRequired ?? false) : !scheme.eligibility?.disabilityRequired);
      const matchesMinistry = ministryFilter === "All" || (ministryFilter === "Central" ? scheme.level === "Central" : scheme.level === "State");

      return (
        matchesSearch && matchesState && matchesCategory && matchesType && matchesGender && matchesOccupation && matchesEducation && matchesIncome && matchesDisability && matchesMinistry
      );
    });
  }, [categoryFilter, recommendations, schemeTypeFilter, search, stateFilter, genderFilter, occupationFilter, educationFilter, incomeFilter, disabilityFilter, ministryFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schemes"
        description="Browse the schemes that match the citizen profile and supporting documents you have shared."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Schemes" }]}
      />

      <Section title="Discovery filters" description="Search the available schemes and inspect the next steps for each recommendation.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="w-full border-0 bg-transparent outline-none" placeholder="Search schemes" value={search} onChange={(event) => setSearch(event.target.value)} />
          </label>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={stateFilter} onChange={(event) => setStateFilter(event.target.value)}>
            <option value="All">All states</option>
            {indianStatesAndUTs.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="All">All categories</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Housing">Housing</option>
            <option value="Social Welfare">Social Welfare</option>
            <option value="Employment">Employment</option>
            <option value="Women & Child">Women & Child</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={schemeTypeFilter} onChange={(event) => setSchemeTypeFilter(event.target.value)}>
            <option value="All">All scheme types</option>
            <option value="Central">Central</option>
            <option value="State">State</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="All">All genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Any">Any</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={occupationFilter} onChange={(e) => setOccupationFilter(e.target.value)}>
            <option value="All">All occupations</option>
            <option value="Farmer">Farmer</option>
            <option value="Student">Student</option>
            <option value="Self Employed">Self Employed</option>
            <option value="Unemployed">Unemployed</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={educationFilter} onChange={(e) => setEducationFilter(e.target.value)}>
            <option value="All">All education levels</option>
            <option value="School">School</option>
            <option value="Higher secondary">Higher secondary</option>
            <option value="Any">Any</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={incomeFilter} onChange={(e) => setIncomeFilter(e.target.value)}>
            <option value="All">All incomes</option>
            <option value="< 100000">Below ₹100,000</option>
            <option value="< 200000">Below ₹200,000</option>
            <option value="< 300000">Below ₹300,000</option>
            <option value="< 500000">Below ₹500,000</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={disabilityFilter} onChange={(e) => setDisabilityFilter(e.target.value)}>
            <option value="All">Any disability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={ministryFilter} onChange={(e) => setMinistryFilter(e.target.value)}>
            <option value="All">All ministries</option>
            <option value="Central">Central</option>
            <option value="State">State</option>
          </select>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <LoadingSkeleton />
            <LoadingSkeleton />
          </div>
        ) : filteredSchemes.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-3">
              {filteredSchemes.map((scheme) => (
                <button key={scheme.id} type="button" onClick={() => setSelectedScheme(scheme)} className={`w-full rounded-2xl border p-4 text-left ${selectedScheme?.id === scheme.id ? "border-primary bg-primary/5" : "bg-background"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium">{scheme.title}</h3>
                    <span className="text-sm font-semibold text-primary">{scheme.eligibility_score}%</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{scheme.reason}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">{scheme.category} • {scheme.level}</p>
                </button>
              ))}
            </div>

            <div className="rounded-2xl border bg-background p-5">
              {selectedScheme ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold">{selectedScheme.title}</h3>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{selectedScheme.eligibility_score}% match</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{selectedScheme.reason}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full border px-3 py-1">{selectedScheme.category}</span>
                    <span className="rounded-full border px-3 py-1">{selectedScheme.level}</span>
                    {selectedScheme.state ? <span className="rounded-full border px-3 py-1">{selectedScheme.state}</span> : null}
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="text-sm font-semibold">Required documents</h4>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {selectedScheme.required_documents.map((document) => (
                          <li key={document}>• {document}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">Benefits</h4>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {selectedScheme.benefits.map((benefit) => (
                          <li key={benefit}>• {benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3 rounded-2xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Matching criteria:</span> {selectedScheme.matching_criteria?.length ? selectedScheme.matching_criteria.join(" ") : "Your profile is being evaluated against the published criteria."}</p>
                    <p><span className="font-semibold text-foreground">Missing documents:</span> {selectedScheme.missing_documents?.length ? selectedScheme.missing_documents.join(", ") : "No missing documents based on the uploaded files."}</p>
                    <p><span className="font-semibold text-foreground">Eligibility rules:</span> {selectedScheme.eligibility_rules ?? "Official guidance is summarized for the current profile."}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {selectedScheme.official_apply_url ? <a href={selectedScheme.official_apply_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary">Apply now</a> : null}
                    {selectedScheme.official_scheme_url ? <a href={selectedScheme.official_scheme_url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary">Official portal</a> : null}
                  </div>
                  <Button className="mt-6">Continue application</Button>
                </>
              ) : (
                <EmptyState title="No selection" description="Choose a scheme from the list to inspect the next steps." />
              )}
            </div>
          </div>
        ) : (
          <EmptyState title="No matching schemes" description="Try a broader keyword or refine your profile details to see more relevant options." />
        )}
      </Section>
    </div>
  );
}
