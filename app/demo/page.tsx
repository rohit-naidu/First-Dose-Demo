"use client";

/**
 * /demo — auto-launches the hackathon demo on page load.
 * Useful as a bookmarkable URL for judges: http://localhost:3000/demo
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ui } from "@/lib/ui/clinicalTheme";

export default function DemoAutoLaunchPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function launch() {
      try {
        const res = await fetch("/api/demo/launch", { method: "POST" });
        const data = await res.json();
        if (!cancelled && res.ok) {
          router.replace(data.url ?? "/cases/demo-alex-mercer?demo=1");
        }
      } catch {
        if (!cancelled) router.replace("/");
      }
    }

    launch();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className={ui.app}>
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-[#003366]" />
        <p className="text-sm font-semibold text-[#003366]">Preparing Alex Mercer demo case…</p>
        <p className="text-xs text-[#555]">Running 5-stage science pipeline</p>
      </div>
    </main>
  );
}
