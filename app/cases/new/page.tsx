"use client";

import Link from "next/link";
import { Dna, ShieldCheck } from "lucide-react";
import { IntakeForm } from "@/components/clinical/IntakeForm";
import { ui } from "@/lib/ui/clinicalTheme";

/**
 * New case intake page — collects patient demographics and creates a case.
 */
export default function NewCasePage() {
  return (
    <main className={ui.app}>
      <div className={ui.layout}>
        <aside className={ui.sidebar}>
          <div className={ui.sidebarBrand}>
            <Dna className="h-5 w-5 text-[#003366]" />
            <div>
              <p className={ui.sidebarTitle}>First Dose Health</p>
              <h1 className="text-sm font-bold">New case intake</h1>
            </div>
          </div>
          <Link className={ui.navItem} href="/">
            ← Back to cases
          </Link>
          <div className={ui.sidebarNote}>
            <ShieldCheck className="mb-1 inline h-4 w-4 text-[#003366]" /> Default drug: retatrutide
          </div>
        </aside>

        <section className={ui.workArea}>
          <div className={ui.content}>
            <p className={ui.sectionHeading}>Patient intake form</p>
            <IntakeForm />
          </div>
        </section>
      </div>
    </main>
  );
}
