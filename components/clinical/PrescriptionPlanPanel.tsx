"use client";

/**
 * Prescription plan panel — shows composed plan action cards from live case data.
 */

import { priorityClasses } from "@/lib/clinical/severityStyles";
import type { ComposedPlan } from "@/lib/planning/types";
import { ui } from "@/lib/ui/clinicalTheme";

type PrescriptionPlanPanelProps = {
  plan: ComposedPlan;
  onSelectGene?: (marker: string) => void;
};

export function PrescriptionPlanPanel({ plan, onSelectGene }: PrescriptionPlanPanelProps) {
  return (
    <div className={ui.panel}>
      <div className={ui.panelTitle}>Composed prescription plan — {plan.drug}</div>
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
                    {card.because.map((b) =>
                      onSelectGene ? (
                        <button
                          key={b.marker}
                          className={ui.geneChip}
                          onClick={() => onSelectGene(b.marker)}
                          type="button"
                        >
                          {b.gene}
                        </button>
                      ) : (
                        <span key={b.marker} className={ui.geneChip}>
                          {b.gene}
                        </span>
                      ),
                    )}
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
