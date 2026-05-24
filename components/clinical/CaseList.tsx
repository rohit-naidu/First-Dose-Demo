"use client";

/**
 * Case list table for the home page.
 * Fetches /api/cases and links to each workstation.
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CaseListItem } from "@/lib/cases/types";
import { ui } from "@/lib/ui/clinicalTheme";

export function CaseList() {
  const [cases, setCases] = useState<CaseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        setCases(data.cases ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load cases");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={ui.muted}>Loading cases…</p>;
  if (error) return <p className="text-sm text-[#800000]">{error}</p>;

  if (cases.length === 0) {
    return (
      <div className={ui.panel}>
        <div className={ui.panelBody}>
          <p className={ui.bodyText}>No cases yet. Create one from the intake form.</p>
          <Link className={`${ui.btnPrimary} mt-2 inline-flex`} href="/cases/new">
            New case intake
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={ui.tableWrap}>
      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {["Patient", "Status", "Drug", "Updated", ""].map((h) => (
              <th key={h} className={ui.th}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id} className="odd:bg-white even:bg-[#f7f7f7]">
              <td className={`${ui.td} font-semibold`}>
                {c.patientName}
                {c.isDemo ? (
                  <span className="ml-1 border border-[#665500] bg-[#fff8dc] px-1 text-xs font-normal text-[#665500]">
                    DEMO
                  </span>
                ) : null}
              </td>
              <td className={ui.td}>{c.status.replace(/_/g, " ")}</td>
              <td className={ui.td}>{c.targetDrug}</td>
              <td className={`${ui.td} text-xs`}>
                {new Date(c.updatedAt).toLocaleString()}
              </td>
              <td className={ui.td}>
                <Link
                  className={ui.btnPrimary}
                  href={c.isDemo ? `/cases/${c.id}?demo=1` : `/cases/${c.id}`}
                >
                  Open
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
