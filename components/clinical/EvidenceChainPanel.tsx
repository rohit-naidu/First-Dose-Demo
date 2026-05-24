"use client";

/**
 * Shows the 5-stage science pipeline evidence chain for one case.
 */

import { ui } from "@/lib/ui/clinicalTheme";

type ChainStep = {
  stage: string;
  summary: string;
  count?: number;
};

type EvidenceChainPanelProps = {
  steps: ChainStep[];
  kbVersion?: string;
};

export function EvidenceChainPanel({ steps, kbVersion }: EvidenceChainPanelProps) {
  return (
    <div className={ui.panel}>
      <div className={ui.panelTitle}>
        Science engine evidence chain
        {kbVersion ? ` · KB ${kbVersion}` : ""}
      </div>
      <div className={ui.panelBody}>
        <ol className="list-decimal pl-5 text-sm">
          {steps.map((step) => (
            <li key={step.stage} className="mb-2">
              <strong>{step.stage}</strong> — {step.summary}
              {step.count !== undefined ? (
                <span className="text-[#003366]"> ({step.count})</span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
