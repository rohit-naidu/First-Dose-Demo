"use client";

/**
 * On-screen 3-minute demo script for judges.
 * Anchors scroll to science → clinical brief → Rx plan sections.
 */

import { ChevronRight, FlaskConical, Microscope, Pill, Stethoscope } from "lucide-react";
import { ui } from "@/lib/ui/clinicalTheme";

type DemoGuideBannerProps = {
  onJumpTo: (sectionId: string) => void;
  onOpenGlp1r: () => void;
  kbVersion?: string;
  panelFound?: number;
  panelTotal?: number;
};

const STEPS = [
  {
    time: "0:00–1:00",
    title: "5-stage science engine",
    detail:
      "Parse 8 panel SNPs → annotate genes → match curated PubMed KB → merge reported nausea with genetics → emit Rx triggers. Not an LLM — deterministic pipeline we built.",
    sectionId: "demo-science-review",
    icon: Microscope,
  },
  {
    time: "1:00–1:45",
    title: "Evidence depth",
    detail:
      "Open GLP1R (rs10305492): receptor-level variant → split-dose cadence. Every call cites mechanism + PMID/DOI.",
    action: "glp1r" as const,
    icon: FlaskConical,
  },
  {
    time: "1:45–2:30",
    title: "Clinical synthesis",
    detail:
      "Concordant nausea: patient reported it AND GLP1R + TCF7L2 predict it. Composite side-effect profile drives the plan.",
    sectionId: "demo-clinical-brief",
    icon: Stethoscope,
  },
  {
    time: "2:30–3:00",
    title: "Rx plan + sign-off",
    detail:
      "Retatrutide split cadence, week-by-week titration, hold criteria. Approve → pharmacy JSON transmission.",
    sectionId: "demo-prescription-plan",
    icon: Pill,
  },
];

export function DemoGuideBanner({
  onJumpTo,
  onOpenGlp1r,
  kbVersion,
  panelFound,
  panelTotal,
}: DemoGuideBannerProps) {
  return (
    <div className="border-2 border-[#665500] bg-[#fff8dc]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#665500] bg-[#665500] px-3 py-2 text-white">
        <p className="text-sm font-bold">Demo mode · 3-minute script</p>
        <p className="text-xs">
          Science built in-house: 5-stage pipeline · Evidence KB {kbVersion ?? "demo-v1"} ·{" "}
          {panelFound ?? 8}/{panelTotal ?? 8} panel SNPs
        </p>
      </div>
      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.time}
              className="border border-[#665500] bg-white p-2 text-left transition hover:bg-[#fffef5]"
              onClick={() => {
                if (step.action === "glp1r") onOpenGlp1r();
                else if (step.sectionId) onJumpTo(step.sectionId);
              }}
              type="button"
            >
              <div className="flex items-center gap-1 text-xs font-bold text-[#665500]">
                <Icon className="h-3 w-3" />
                {step.time}
                <ChevronRight className="ml-auto h-3 w-3" />
              </div>
              <p className="mt-1 text-sm font-semibold text-[#003366]">{step.title}</p>
              <p className="mt-0.5 text-xs text-[#555]">{step.detail}</p>
            </button>
          );
        })}
      </div>
      <p className={`border-t border-[#665500] px-3 py-1.5 text-xs ${ui.muted}`}>
        Tip: all 5 pipeline stages are expanded below. Click stage pills to jump. Genetics inform the
        plan — physician verification required (FDA CDS Class I).
      </p>
    </div>
  );
}
