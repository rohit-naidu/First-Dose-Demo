"use client";

import {
  impactTierClasses,
  likelihoodClasses,
  priorityClasses,
} from "@/lib/clinical/severityStyles";
import type { GeneClinicalProfile } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";

type GeneActionCardProps = {
  profile: GeneClinicalProfile;
  onViewDetail: (marker: string) => void;
};

export function GeneActionCard({ profile, onViewDetail }: GeneActionCardProps) {
  const styles = impactTierClasses(profile.severity);

  return (
    <article className={styles.border}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#c0c0c0] bg-[#d4d0c8] px-2 py-1">
        <p className="text-xs font-bold">
          {profile.gene} · {profile.marker} · {profile.genotype}
        </p>
        <span className={styles.badge}>{profile.severity}</span>
      </div>
      <div className="p-2">
        <p className="font-semibold">{profile.interpretation}</p>

        <table className={`${ui.table} mt-2`}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.th} colSpan={2}>
                Side effects to watch
              </th>
            </tr>
          </thead>
          <tbody>
            {profile.sideEffects.map((se) => (
              <tr key={se.event} className="odd:bg-white even:bg-[#fafafa]">
                <td className={`${ui.td} w-28 ${likelihoodClasses(se.likelihood)}`}>
                  {se.likelihood}
                </td>
                <td className={ui.td}>
                  {se.event}
                  <span className="text-xs text-[#555]"> ({se.onsetWindow})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className={`${ui.table} mt-2`}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.th} colSpan={2}>
                Prescribing actions
              </th>
            </tr>
          </thead>
          <tbody>
            {profile.prescribingActions.map((pa) => (
              <tr key={pa.action} className="odd:bg-white even:bg-[#fafafa]">
                <td className={ui.td}>
                  <span className={priorityClasses(pa.priority)}>{pa.priority}</span>
                </td>
                <td className={ui.td}>{pa.action}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className={`${ui.btn} mt-2 w-full`}
          onClick={() => onViewDetail(profile.marker)}
          type="button"
        >
          View CPIC detail…
        </button>
      </div>
    </article>
  );
}
