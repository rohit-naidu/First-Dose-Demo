"use client";

import { useState } from "react";
import type { GeneClinicalProfile } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";
import { GeneActionCard } from "./GeneActionCard";

type GeneActionCardsSectionProps = {
  onViewDetail: (marker: string) => void;
  /** Live gene profiles from pipeline; required for workstation view. */
  profiles: GeneClinicalProfile[];
};

export function GeneActionCardsSection({ onViewDetail, profiles }: GeneActionCardsSectionProps) {
  const [showSupportive, setShowSupportive] = useState(false);
  const primary = profiles.filter((p) => p.severity === "High" || p.severity === "Moderate");
  const supportive = profiles.filter((p) => p.severity === "Supportive");

  if (profiles.length === 0) return null;

  return (
    <section>
      <p className={ui.sectionHeading}>Gene-level clinical actions (high / moderate)</p>
      <div className="grid gap-2 lg:grid-cols-2">
        {primary.map((profile) => (
          <GeneActionCard key={profile.marker} onViewDetail={onViewDetail} profile={profile} />
        ))}
      </div>

      {supportive.length > 0 ? (
        <div className={`${ui.panel} mt-2`}>
          <button
            className={`${ui.panelTitle} flex w-full items-center justify-between hover:bg-[#c8c4bc]`}
            onClick={() => setShowSupportive((v) => !v)}
            type="button"
          >
            <span>Also relevant (supportive): {supportive.map((p) => p.gene).join(", ")}</span>
            <span className="font-normal normal-case">{showSupportive ? "[−]" : "[+]"}</span>
          </button>
          {showSupportive ? (
            <div className="grid gap-2 p-2 lg:grid-cols-2">
              {supportive.map((profile) => (
                <GeneActionCard key={profile.marker} onViewDetail={onViewDetail} profile={profile} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
