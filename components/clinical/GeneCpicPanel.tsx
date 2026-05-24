"use client";

import type { GeneClinicalProfile } from "@/lib/clinical/types";
import { likelihoodClasses } from "@/lib/clinical/severityStyles";
import { ui } from "@/lib/ui/clinicalTheme";

type GeneCpicPanelProps = {
  profile: GeneClinicalProfile;
};

export function GeneCpicPanel({ profile }: GeneCpicPanelProps) {
  const { cpic } = profile;

  return (
    <div className="border border-[#003366] bg-[#f8fbff]">
      <div className="border-b border-[#003366] bg-[#003366] px-2 py-1 text-xs font-bold text-white">
        Pharmacogenomic recommendation (CPIC-style)
      </div>
      <div className="p-2">
        <table className={ui.table}>
          <tbody>
            <CpicRow label="Gene / variant" value={`${profile.gene} (${profile.marker}, ${profile.genotype})`} />
            <CpicRow label="Phenotype" value={profile.interpretation} />
            <CpicRow label="Drugs affected" value={cpic.drugs.join(", ")} />
            <CpicRow label="Strength" value={cpic.strength} highlight />
            <tr className="bg-white">
              <td className={`${ui.td} align-top font-bold`}>Recommendation</td>
              <td className={ui.td}>{cpic.recommendation}</td>
            </tr>
          </tbody>
        </table>

        <p className="mt-2 text-xs font-bold uppercase">Alternatives</p>
        <ul className="mt-1 list-inside list-disc text-sm text-[#333]">
          {cpic.alternatives.map((alt) => (
            <li key={alt}>{alt}</li>
          ))}
        </ul>

        <p className="mt-2 text-xs font-bold uppercase">Side-effect mechanisms</p>
        <table className={`${ui.table} mt-1`}>
          <thead className={ui.tableHead}>
            <tr>
              <th className={ui.th}>Event</th>
              <th className={ui.th}>Mechanism</th>
            </tr>
          </thead>
          <tbody>
            {profile.sideEffects.map((se) => (
              <tr key={se.event} className="odd:bg-white even:bg-[#f7f7f7]">
                <td className={`${ui.td} ${likelihoodClasses(se.likelihood)}`}>
                  {se.event} ({se.likelihood})
                </td>
                <td className={ui.td}>{se.mechanism}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className={`mt-2 ${ui.muted}`}>Evidence level: {profile.deepDive.evidenceLevel}</p>
      </div>
    </div>
  );
}

function CpicRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <tr className="odd:bg-white even:bg-[#f7f7f7]">
      <td className={`${ui.td} w-36 font-bold`}>{label}</td>
      <td className={`${ui.td} ${highlight ? "font-semibold text-[#003366]" : ""}`}>{value}</td>
    </tr>
  );
}
