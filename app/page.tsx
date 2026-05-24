"use client";

import Link from "next/link";
import { Dna, FlaskConical, Route, ScrollText, ShieldCheck, Users } from "lucide-react";
import { CaseList } from "@/components/clinical/CaseList";
import { DemoLauncher } from "@/components/clinical/DemoLauncher";
import { ui } from "@/lib/ui/clinicalTheme";

const navigationItems = [
  { label: "Patients", icon: Users, active: true, href: "/" },
  { label: "Molecular Analytics", icon: FlaskConical, active: false, href: "/" },
  { label: "Pharmacy Routing", icon: Route, active: false, href: "/" },
  { label: "Audit Logs", icon: ScrollText, active: false, href: "/" },
];

/**
 * Home page — lists all clinical cases and links to intake / workstations.
 */
export default function HomePage() {
  return (
    <main className={ui.app}>
      <div className={ui.layout}>
        <aside className={ui.sidebar}>
          <div className={ui.sidebarBrand}>
            <Dna className="h-5 w-5 text-[#003366]" />
            <div>
              <p className={ui.sidebarTitle}>First Dose Health</p>
              <h1 className="text-sm font-bold">Clinical Workstation v2.4</h1>
            </div>
          </div>

          <nav>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  className={item.active ? ui.navItemActive : ui.navItem}
                  href={item.href}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={ui.sidebarNote}>
            <ShieldCheck className="mb-1 inline h-4 w-4 text-[#003366]" /> Secure runtime — physician
            review required for CDS output.
          </div>
        </aside>

        <section className={ui.workArea}>
          <div className={ui.content}>
            <header className={ui.banner}>
              <div className={ui.bannerInner}>
                <div>
                  <p className={ui.bannerLabel}>Case management</p>
                  <h2 className={ui.bannerTitle}>Patient cases</h2>
                  <p className="mt-0.5 text-xs text-[#b8d4f0]">
                    Create intake → upload 23andMe → run science pipeline → physician review
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DemoLauncher variant="compact" />
                  <Link className={ui.btn} href="/cases/new">
                    New case intake
                  </Link>
                </div>
              </div>
            </header>

            <DemoLauncher variant="hero" />

            <CaseList />
          </div>
        </section>
      </div>
    </main>
  );
}
