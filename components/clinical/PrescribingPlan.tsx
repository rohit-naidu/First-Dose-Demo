"use client";

import { priorityClasses } from "@/lib/clinical/severityStyles";
import type { PrescribingPlanSummary } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";

type PrescribingPlanProps = {
  plan: PrescribingPlanSummary;
  onSelectGene: (marker: string) => void;
};

export function PrescribingPlan({ plan, onSelectGene }: PrescribingPlanProps) {
  return (
    <div className={ui.panel}>
      <div className={ui.panelTitle}>Prescribing decision summary</div>
      <div className={ui.panelBody}>
        <table className={`${ui.table} mb-2`}>
          <tbody>
            {[
              ["Molecule", plan.molecule],
              ["Cadence", plan.cadence],
              ["Starting dose", plan.startingDose],
              ["Escalation", plan.escalationRule],
            ].map(([label, value]) => (
              <tr key={label} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={`${ui.td} w-32 font-bold`}>{label}</td>
                <td className={ui.td}>{value}</td>
              </tr>
            ))}
            <tr className="bg-[#fff8dc]">
              <td className={`${ui.td} font-bold text-[#665500]`}>Hold criteria</td>
              <td className={`${ui.td} text-[#4a3800]`}>{plan.holdCriteria}</td>
            </tr>
          </tbody>
        </table>

        <p className="mb-1 text-xs font-bold uppercase">Action items</p>
        <table className={ui.table}>
          <thead className={ui.tableHead}>
            <tr>
              {["Item", "Detail", "Priority", "Because"].map((h) => (
                <th key={h} className={ui.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.actionCards.map((card) => (
              <tr key={card.title} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={`${ui.td} font-semibold`}>{card.title}</td>
                <td className={ui.td}>{card.detail}</td>
                <td className={ui.td}>
                  <span className={priorityClasses(card.priority)}>{card.priority}</span>
                </td>
                <td className={ui.td}>
                  <div className="flex flex-wrap gap-1">
                    {card.because.map((b) => (
                      <button
                        key={b.marker}
                        className={ui.geneChip}
                        onClick={() => onSelectGene(b.marker)}
                        type="button"
                      >
                        {b.gene}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
