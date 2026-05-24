"use client";

import { impactTierClasses } from "@/lib/clinical/severityStyles";
import type { VariantTableRow } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";

type VariantTableProps = {
  rows: VariantTableRow[];
  onSelectGene: (marker: string) => void;
};

export function VariantTable({ rows, onSelectGene }: VariantTableProps) {
  return (
    <div className={ui.tableWrap}>
      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {["Gene", "rsID", "Genotype", "Clinical tag", "Impact"].map((h) => (
              <th key={h} className={ui.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const styles = impactTierClasses(row.impactTier);
            return (
              <tr
                key={row.marker}
                className={ui.tableRow}
                onClick={() => onSelectGene(row.marker)}
              >
                <td className={`${ui.td} font-semibold`}>{row.gene}</td>
                <td className={`${ui.td} font-mono text-xs`}>{row.marker}</td>
                <td className={ui.td}>{row.genotype}</td>
                <td className={ui.td}>{row.clinicalTag}</td>
                <td className={ui.td}>
                  <span className={styles.badge}>{row.impactTier}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
