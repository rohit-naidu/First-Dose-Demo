"use client";

import { likelihoodClasses } from "@/lib/clinical/severityStyles";
import type { CompositeSideEffect } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";

type SideEffectProfileProps = {
  effects: CompositeSideEffect[];
  onSelectGene: (marker: string) => void;
};

export function SideEffectProfile({ effects, onSelectGene }: SideEffectProfileProps) {
  return (
    <div className={ui.calloutWarn}>
      <p className="mb-2 text-xs font-bold uppercase">Predicted side-effect profile</p>
      <p className={`mb-2 ${ui.muted}`}>
        Likelihood = predicted level · Risk = clinical urgency · Click gene tags for detail
      </p>
      <table className={`${ui.table} min-w-0`}>
        <thead className={ui.tableHead}>
          <tr>
            {["Adverse event", "Likelihood", "Risk", "Onset", "Driven by"].map((h) => (
              <th key={h} className={ui.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {effects.slice(0, 6).map((effect) => (
            <tr key={effect.event} className="odd:bg-white even:bg-[#f7f7f7]">
              <td className={ui.td}>
                <span className="font-semibold">{effect.event}</span>
                <p className="mt-0.5 text-xs text-[#555]">{effect.mechanism}</p>
              </td>
              <td className={`${ui.td} ${likelihoodClasses(effect.likelihood)}`}>
                {effect.likelihood}
              </td>
              <td className={ui.td}>{effect.riskLabel}</td>
              <td className={ui.td}>{effect.onsetWindow}</td>
              <td className={ui.td}>
                <div className="flex flex-wrap gap-1">
                  {effect.drivenBy.map((d) => (
                    <button
                      key={d.marker}
                      className={ui.geneChip}
                      onClick={() => onSelectGene(d.marker)}
                      type="button"
                    >
                      {d.gene}
                    </button>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
