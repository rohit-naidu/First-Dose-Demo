"use client";

/**
 * One-click hackathon demo launcher.
 * Calls POST /api/demo/launch then routes to the pre-built Alex Mercer workstation.
 */

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlaskConical, Loader2, Play, Sparkles } from "lucide-react";
import { ui } from "@/lib/ui/clinicalTheme";

type DemoLauncherProps = {
  /** "hero" = large banner card on home; "compact" = inline button */
  variant?: "hero" | "compact";
};

export function DemoLauncher({ variant = "hero" }: DemoLauncherProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function launchDemo() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/demo/launch", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Demo launch failed");
      router.push(data.url ?? "/cases/demo-alex-mercer?demo=1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Demo launch failed");
      setLoading(false);
    }
  }

  if (variant === "compact") {
    return (
      <div>
        <button
          className={`${ui.btnPrimary} inline-flex items-center gap-2`}
          disabled={loading}
          onClick={launchDemo}
          type="button"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          {loading ? "Preparing demo…" : "Launch 3-min demo"}
        </button>
        {error ? <p className="mt-1 text-sm text-[#800000]">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="mb-4 border-2 border-[#003366] bg-gradient-to-br from-[#e8f4ff] to-white">
      <div className="border-b border-[#003366] bg-[#003366] px-3 py-2 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <p className="text-xs font-semibold uppercase tracking-wide">Hackathon demo · ~3 minutes</p>
        </div>
      </div>
      <div className="p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h3 className="text-base font-bold text-[#003366]">Launch pre-built Alex Mercer case</h3>
            <p className="mt-1 text-sm text-[#333]">
              One click loads intake + 23andMe genomic file + full{" "}
              <strong>5-stage science pipeline</strong> (parse → annotate → evidence match → symptom
              synthesis → plan triggers). All 8 PGx loci, curated PubMed KB, and retatrutide plan — ready
              to present.
            </p>
            <ul className="mt-2 grid gap-1 text-xs text-[#555] sm:grid-cols-2">
              <li className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-[#003366]" /> 8-SNP incretin / metabolic panel
              </li>
              <li className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-[#003366]" /> Evidence KB v2026.05.24-demo-v1
              </li>
              <li className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-[#003366]" /> GLP1R · TCF7L2 · PPARG deep dives
              </li>
              <li className="flex items-center gap-1">
                <FlaskConical className="h-3 w-3 text-[#003366]" /> Physician approve → pharmacy route
              </li>
            </ul>
          </div>
          <button
            className={`${ui.btnPrimary} shrink-0 px-6 py-3 text-base`}
            disabled={loading}
            onClick={launchDemo}
            type="button"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Running pipeline…
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Launch demo
              </>
            )}
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-[#800000]">{error}</p> : null}
      </div>
    </div>
  );
}
