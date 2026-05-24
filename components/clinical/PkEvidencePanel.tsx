"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { molecularEvidenceSummary, pkCurveData, pkGeneBridgeCopy } from "@/lib/clinical/constants";
import type { ChartPoint } from "@/lib/clinical/types";
import { ui } from "@/lib/ui/clinicalTheme";

type TooltipPayload = {
  name: string;
  value: number;
  color?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-[#808080] bg-white p-2 text-xs shadow-sm">
      <p className="mb-1 font-bold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name}>
          {entry.name}: <strong>{entry.value}</strong> ng/mL
        </p>
      ))}
    </div>
  );
}

type PkEvidencePanelProps = {
  /** Optional override for PK bridge copy (defaults to static demo text). */
  bridgeCopy?: string;
};

export function PkEvidencePanel({ bridgeCopy = pkGeneBridgeCopy }: PkEvidencePanelProps) {
  return (
    <div className="space-y-2">
      <p className={`${ui.insetBox} text-sm`}>
        <strong>PK rationale:</strong> {bridgeCopy}
      </p>

      <table className={ui.table}>
        <thead className={ui.tableHead}>
          <tr>
            {molecularEvidenceSummary.map((item) => (
              <th key={item.label} className={ui.th}>
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {molecularEvidenceSummary.map((item) => (
              <td key={item.label} className={ui.td}>
                <strong className="text-base">{item.value}</strong>
                <p className="mt-1 text-xs text-[#555]">{item.detail}</p>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <p className="text-xs">
        <span className="mr-3 inline-block h-2 w-4 bg-[#cc0000]" /> Standard weekly (semaglutide)
        <span className="ml-4 mr-3 inline-block h-2 w-4 bg-[#003366]" /> Optimized split
        (tirzepatide)
      </p>

      <div className={ui.chartBox}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={pkCurveData as ChartPoint[]} margin={{ top: 20, right: 12, left: 4, bottom: 12 }}>
            <CartesianGrid stroke="#c0c0c0" strokeDasharray="2 2" />
            <XAxis dataKey="week" stroke="#333" tick={{ fill: "#333", fontSize: 11 }} tickLine={false} />
            <YAxis
              domain={[0, 100]}
              label={{
                value: "Plasma ng/mL",
                angle: -90,
                position: "insideLeft",
                fill: "#333",
                fontSize: 11,
              }}
              stroke="#333"
              tick={{ fill: "#333", fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <ReferenceArea
              y1={24}
              y2={48}
              fill="#316AC5"
              fillOpacity={0.08}
              label={{ value: "Therapeutic window", position: "insideTopLeft", fill: "#003366", fontSize: 10 }}
            />
            <ReferenceArea
              y1={72}
              y2={100}
              fill="#cc0000"
              fillOpacity={0.08}
              label={{ value: "Toxicity threshold", position: "insideTopRight", fill: "#800000", fontSize: 10 }}
            />
            <Line
              dataKey="standard"
              dot={{ r: 2, strokeWidth: 1 }}
              name="Standard protocol"
              stroke="#cc0000"
              strokeDasharray="4 4"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="optimized"
              dot={{ r: 2, strokeWidth: 1 }}
              name="Optimized protocol"
              stroke="#003366"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className={ui.insetBox}>
        Model weights: receptor PD, beta-cell incretin sensitivity, appetite pathway, adipocyte
        signaling, hepatic context. High-impact variants favor split cadence over weekly peaks.
      </p>
    </div>
  );
}
