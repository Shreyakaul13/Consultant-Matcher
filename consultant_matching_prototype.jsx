import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Database, Sparkles, Users, Briefcase, CheckCircle2, Filter, Clock3, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const consultants = [
  {
    id: 1,
    name: "Asha Raman",
    title: "Finance & PPP Consultant",
    years: 14,
    location: "London",
    availability: "Available in 2 weeks",
    sectors: ["Transport", "Urban Mobility", "Public Finance"],
    skills: ["PPP", "Financial Modelling", "Bid Support", "Feasibility"],
    projects: ["Metro financing strategy", "Transit PPP advisory", "Multilateral-funded mobility programme"],
    summary:
      "Advised public-sector transport and infrastructure programmes on financial structuring, PPP assessment, and delivery strategy.",
  },
  {
    id: 2,
    name: "Daniel Mercer",
    title: "Procurement & Delivery Advisor",
    years: 11,
    location: "Manchester",
    availability: "Available now",
    sectors: ["Energy", "Transport", "Utilities"],
    skills: ["Public Procurement", "Commercial Strategy", "Programme Delivery", "Risk Management"],
    projects: ["Grid expansion programme", "Rail procurement transformation", "Utility delivery PMO"],
    summary:
      "Specialises in procurement design, commercial frameworks, and complex programme delivery in regulated sectors.",
  },
  {
    id: 3,
    name: "Neha Sethi",
    title: "Infrastructure Strategy Consultant",
    years: 8,
    location: "Dubai",
    availability: "Available in 1 month",
    sectors: ["Urban Development", "Transport", "Government Advisory"],
    skills: ["Options Analysis", "Business Cases", "Stakeholder Management", "Policy"],
    projects: ["Mobility strategy study", "City infrastructure roadmap", "Government transformation advisory"],
    summary:
      "Combines strategic analysis and stakeholder-heavy delivery across public infrastructure and urban advisory work.",
  },
  {
    id: 4,
    name: "Farah Khan",
    title: "Capital Projects Finance Specialist",
    years: 16,
    location: "Riyadh",
    availability: "Available now",
    sectors: ["Transport", "Aviation", "Public Finance"],
    skills: ["Investment Analysis", "CAPEX/OPEX Modelling", "Due Diligence", "Funding Strategy"],
    projects: ["Airport capex review", "Rail affordability model", "National infrastructure investment plan"],
    summary:
      "Experienced in financing strategy, affordability, and investment analysis for large-scale capital programmes.",
  },
  {
    id: 5,
    name: "Omar El-Badry",
    title: "Digital PMO & Transformation Lead",
    years: 10,
    location: "Cairo",
    availability: "Available in 3 weeks",
    sectors: ["Government Advisory", "Digital Transformation", "Transport"],
    skills: ["PMO", "Reporting", "Governance", "Transformation"],
    projects: ["Government PMO setup", "Digital portfolio reporting", "Transport authority governance redesign"],
    summary:
      "Leads PMO and transformation work, with strong governance and implementation management experience.",
  },
  {
    id: 6,
    name: "Lucy Bennett",
    title: "Financial Advisory Manager",
    years: 9,
    location: "London",
    availability: "Available now",
    sectors: ["Energy", "Water", "Public Finance"],
    skills: ["Financial Modelling", "Transaction Support", "Procurement", "Risk Analysis"],
    projects: ["Water concession review", "Energy transaction support", "Government funding options study"],
    summary:
      "Supports investment and transaction decisions for infrastructure and regulated-sector programmes.",
  },
];

const allSectors = [
  "Transport",
  "Urban Mobility",
  "Public Finance",
  "Energy",
  "Utilities",
  "Government Advisory",
  "Urban Development",
  "Aviation",
  "Digital Transformation",
  "Water",
];

const allSkills = [
  "PPP",
  "Financial Modelling",
  "Bid Support",
  "Feasibility",
  "Public Procurement",
  "Commercial Strategy",
  "Programme Delivery",
  "Risk Management",
  "Options Analysis",
  "Business Cases",
  "Stakeholder Management",
  "Policy",
  "Investment Analysis",
  "CAPEX/OPEX Modelling",
  "Due Diligence",
  "Funding Strategy",
  "PMO",
  "Governance",
  "Transformation",
  "Transaction Support",
  "Risk Analysis",
];

function scoreConsultant(c, criteria) {
  let score = 0;
  const reasons = [];

  if (c.years >= criteria.minYears) {
    score += 25;
    reasons.push(`${c.years} years of experience meets the ${criteria.minYears}+ year requirement.`);
  } else {
    score += Math.max(0, 15 - (criteria.minYears - c.years) * 3);
  }

  const sectorMatches = criteria.sectors.filter((s) => c.sectors.includes(s));
  if (sectorMatches.length > 0) {
    score += sectorMatches.length * 12;
    reasons.push(`Relevant sector exposure: ${sectorMatches.join(", ")}.`);
  }

  const skillMatches = criteria.skills.filter((s) => c.skills.includes(s));
  if (skillMatches.length > 0) {
    score += skillMatches.length * 10;
    reasons.push(`Matches key capability areas: ${skillMatches.join(", ")}.`);
  }

  if (criteria.availability === "any") {
    score += 8;
  } else if (criteria.availability === "now" && c.availability.toLowerCase().includes("now")) {
    score += 12;
    reasons.push("Immediately available.");
  } else if (criteria.availability === "soon" && (c.availability.toLowerCase().includes("now") || c.availability.toLowerCase().includes("2 weeks") || c.availability.toLowerCase().includes("3 weeks"))) {
    score += 10;
    reasons.push("Available within a short timeframe.");
  }

  const keyword = criteria.keyword.trim().toLowerCase();
  if (keyword) {
    const searchable = [c.title, c.summary, ...c.projects, ...c.skills, ...c.sectors].join(" ").toLowerCase();
    if (searchable.includes(keyword)) {
      score += 14;
      reasons.push(`Strong relevance to keyword: “${criteria.keyword}”.`);
    }
  }

  if (criteria.role === "finance" && ["Financial Modelling", "Investment Analysis", "CAPEX/OPEX Modelling", "Funding Strategy"].some((s) => c.skills.includes(s))) {
    score += 10;
  }
  if (criteria.role === "procurement" && ["Public Procurement", "Commercial Strategy"].some((s) => c.skills.includes(s))) {
    score += 10;
  }
  if (criteria.role === "strategy" && ["Options Analysis", "Business Cases", "Stakeholder Management"].some((s) => c.skills.includes(s))) {
    score += 10;
  }
  if (criteria.role === "delivery" && ["Programme Delivery", "PMO", "Governance", "Risk Management"].some((s) => c.skills.includes(s))) {
    score += 10;
  }

  return {
    ...c,
    score: Math.min(score, 100),
    reasons,
  };
}

function PillSelector({ items, selected, toggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <button
            key={item}
            onClick={() => toggle(item)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              active
                ? "border-black bg-black text-white"
                : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

export default function NativeStyleConsultantMatchingPrototype() {
  const [criteria, setCriteria] = useState({
    role: "finance",
    minYears: 10,
    availability: "soon",
    sectors: ["Transport", "Public Finance"],
    skills: ["Financial Modelling", "PPP", "Bid Support"],
    keyword: "government",
  });

  const [onlyTop3, setOnlyTop3] = useState(true);

  const results = useMemo(() => {
    const ranked = consultants
      .map((c) => scoreConsultant(c, criteria))
      .sort((a, b) => b.score - a.score);
    return onlyTop3 ? ranked.slice(0, 3) : ranked;
  }, [criteria, onlyTop3]);

  const toggleSector = (sector) => {
    setCriteria((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(sector)
        ? prev.sectors.filter((s) => s !== sector)
        : [...prev.sectors, sector],
    }));
  };

  const toggleSkill = (skill) => {
    setCriteria((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / Math.max(results.length, 1));

  return (
    <div className="min-h-screen bg-zinc-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]"
        >
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
                <Badge className="rounded-full">Prototype</Badge>
                <span>AI-assisted consultant matching workflow</span>
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">From consultant CV chaos to shortlist in minutes</CardTitle>
              <CardDescription className="max-w-2xl text-base leading-6 text-zinc-600">
                A lightweight prototype showing how structured consultant data, bid criteria, and AI-style ranking can reduce manual CV screening during public-sector bid submissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { icon: Database, label: "Structured consultant data", value: "6 profiles" },
                  { icon: Filter, label: "Tender criteria", value: "Multi-factor" },
                  { icon: Sparkles, label: "AI-assisted ranking", value: "Top-fit shortlist" },
                  { icon: Users, label: "Human validation", value: "Final review still required" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <item.icon className="mb-3 h-5 w-5 text-zinc-700" />
                    <div className="text-sm text-zinc-500">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold text-zinc-900">{item.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Why this matters</CardTitle>
              <CardDescription>
                Designed for bid teams that need to identify the strongest-fit consultants against detailed role and tender criteria without manually reviewing every CV.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-zinc-700">
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="mb-1 font-medium text-zinc-900">Core workflow</div>
                <div>Collect standardised consultant data → structure it → apply bid criteria → generate a shortlist with rationale.</div>
              </div>
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="mb-1 font-medium text-zinc-900">What AI does</div>
                <div>Accelerates screening, ranking, and pattern-matching across messy information.</div>
              </div>
              <div className="rounded-2xl bg-zinc-100 p-4">
                <div className="mb-1 font-medium text-zinc-900">What humans still do</div>
                <div>Validate fit, assess nuance, handle outreach, and make the final bid decision.</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="matcher" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 rounded-2xl bg-white p-1 shadow-sm md:w-[520px]">
            <TabsTrigger value="matcher" className="rounded-xl">Bid matcher</TabsTrigger>
            <TabsTrigger value="database" className="rounded-xl">Consultant database</TabsTrigger>
            <TabsTrigger value="workflow" className="rounded-xl">Workflow story</TabsTrigger>
          </TabsList>

          <TabsContent value="matcher" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <Card className="rounded-3xl border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Briefcase className="h-5 w-5" />
                    Tender criteria input
                  </CardTitle>
                  <CardDescription>
                    Simulates how a bid manager defines the role requirements before generating a shortlist.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Role type</Label>
                      <Select value={criteria.role} onValueChange={(value) => setCriteria((prev) => ({ ...prev, role: value }))}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="finance">Finance consultant</SelectItem>
                          <SelectItem value="procurement">Procurement advisor</SelectItem>
                          <SelectItem value="strategy">Strategy consultant</SelectItem>
                          <SelectItem value="delivery">Delivery / PMO lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Availability</Label>
                      <Select value={criteria.availability} onValueChange={(value) => setCriteria((prev) => ({ ...prev, availability: value }))}>
                        <SelectTrigger className="rounded-2xl">
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="now">Need someone now</SelectItem>
                          <SelectItem value="soon">Need someone soon</SelectItem>
                          <SelectItem value="any">Any availability</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Minimum years of experience</Label>
                      <Badge variant="secondary" className="rounded-full">{criteria.minYears}+ years</Badge>
                    </div>
                    <Slider
                      value={[criteria.minYears]}
                      min={5}
                      max={20}
                      step={1}
                      onValueChange={(value) => setCriteria((prev) => ({ ...prev, minYears: value[0] }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Preferred sectors</Label>
                    <PillSelector items={allSectors} selected={criteria.sectors} toggle={toggleSector} />
                  </div>

                  <div className="space-y-3">
                    <Label>Required capabilities</Label>
                    <PillSelector items={allSkills} selected={criteria.skills} toggle={toggleSkill} />
                  </div>

                  <div className="space-y-2">
                    <Label>Keyword or tender phrase</Label>
                    <Input
                      className="rounded-2xl"
                      value={criteria.keyword}
                      onChange={(e) => setCriteria((prev) => ({ ...prev, keyword: e.target.value }))}
                      placeholder="e.g. government, rail, concession, PMO"
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4">
                    <Checkbox checked={onlyTop3} onCheckedChange={(checked) => setOnlyTop3(Boolean(checked))} />
                    <div>
                      <div className="text-sm font-medium text-zinc-900">Show only top 3 candidates</div>
                      <div className="text-sm text-zinc-500">Useful for a quick shortlist view during bid planning.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Sparkles className="h-5 w-5" />
                      Shortlisted matches
                    </CardTitle>
                    <CardDescription>
                      Prototype ranking based on years, sector fit, skills match, availability, and keyword relevance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-zinc-100 p-4">
                        <div className="text-sm text-zinc-500">Candidates shown</div>
                        <div className="mt-1 text-2xl font-semibold">{results.length}</div>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4">
                        <div className="text-sm text-zinc-500">Average fit score</div>
                        <div className="mt-1 text-2xl font-semibold">{avgScore}</div>
                      </div>
                      <div className="rounded-2xl bg-zinc-100 p-4">
                        <div className="text-sm text-zinc-500">Workflow mode</div>
                        <div className="mt-1 text-2xl font-semibold">AI-assisted</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {results.map((r, index) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                    >
                      <Card className="rounded-3xl border-0 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className="rounded-full">#{index + 1} match</Badge>
                                <Badge variant="secondary" className="rounded-full">{r.title}</Badge>
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-zinc-900">{r.name}</h3>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">{r.summary}</p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                <div className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {r.years} years</div>
                                <div className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {r.location}</div>
                                <div>{r.availability}</div>
                              </div>
                            </div>
                            <div className="min-w-[160px] rounded-2xl bg-zinc-100 p-4">
                              <div className="text-sm text-zinc-500">Fit score</div>
                              <div className="mt-1 text-3xl font-semibold text-zinc-900">{r.score}</div>
                              <Progress value={r.score} className="mt-3" />
                            </div>
                          </div>

                          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                            <div>
                              <div className="mb-2 text-sm font-medium text-zinc-900">Sector & capability profile</div>
                              <div className="mb-3 flex flex-wrap gap-2">
                                {r.sectors.map((sector) => (
                                  <Badge key={sector} variant="outline" className="rounded-full">{sector}</Badge>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {r.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary" className="rounded-full">{skill}</Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="mb-2 text-sm font-medium text-zinc-900">Why this candidate surfaced</div>
                              <div className="space-y-2">
                                {r.reasons.length > 0 ? (
                                  r.reasons.map((reason, i) => (
                                    <div key={i} className="flex items-start gap-2 rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700">
                                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                      <span>{reason}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="rounded-2xl bg-zinc-100 p-3 text-sm text-zinc-700">General relevance based on role and experience profile.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Database className="h-5 w-5" />
                  Structured consultant database
                </CardTitle>
                <CardDescription>
                  Example of the standardised dataset that makes AI-assisted matching more useful than searching through raw CVs alone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-2xl border border-zinc-200">
                  <table className="w-full min-w-[920px] text-left text-sm">
                    <thead className="bg-zinc-100 text-zinc-600">
                      <tr>
                        <th className="px-4 py-3 font-medium">Consultant</th>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Years</th>
                        <th className="px-4 py-3 font-medium">Location</th>
                        <th className="px-4 py-3 font-medium">Availability</th>
                        <th className="px-4 py-3 font-medium">Sectors</th>
                        <th className="px-4 py-3 font-medium">Capabilities</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultants.map((c) => (
                        <tr key={c.id} className="border-t border-zinc-200 align-top">
                          <td className="px-4 py-4 font-medium text-zinc-900">{c.name}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.title}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.years}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.location}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.availability}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.sectors.join(", ")}</td>
                          <td className="px-4 py-4 text-zinc-700">{c.skills.join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow">
            <div className="grid gap-4 lg:grid-cols-3">
              {[
                {
                  icon: Users,
                  title: "1. Standardise inputs",
                  text: "Collect consultant information in a consistent format instead of relying only on raw CVs with different structures.",
                },
                {
                  icon: Database,
                  title: "2. Structure the data",
                  text: "Move key information into a searchable schema so it can be filtered, ranked, and reused across bid cycles.",
                },
                {
                  icon: Search,
                  title: "3. Query against criteria",
                  text: "Use bid requirements like years, sector, role type, and keywords to surface the strongest-fit shortlist.",
                },
              ].map((step, index) => (
                <Card key={step.title} className="rounded-3xl border-0 shadow-sm">
                  <CardHeader>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-100">
                      <step.icon className="h-5 w-5 text-zinc-700" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                    <CardDescription>{step.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="mt-4 rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl">How to present this in an interview</CardTitle>
                <CardDescription>
                  This prototype is not claiming full automation. It demonstrates structured thinking, workflow design, and practical AI usage in a real operational setting.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700">
                  <div className="mb-2 font-medium text-zinc-900">Lead with the problem</div>
                  Bid teams were spending too much time manually reviewing consultant CVs against tender criteria.
                </div>
                <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700">
                  <div className="mb-2 font-medium text-zinc-900">Show the system</div>
                  You created structured intake, a usable database, and a repeatable matching workflow instead of relying on manual search.
                </div>
                <div className="rounded-2xl bg-zinc-100 p-4 text-sm text-zinc-700">
                  <div className="mb-2 font-medium text-zinc-900">Be honest about AI</div>
                  AI accelerated screening and ranking; humans still validated fit, nuance, and final selection.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
