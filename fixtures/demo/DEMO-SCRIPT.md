# First Dose — 3-Minute Hackathon Demo Script

## Start (pick one)

1. **Home page** → click **Launch demo** (hero card)
2. **Bookmark** → `http://localhost:3000/demo` (auto-launches)
3. **Header** → **Launch 3-min demo** (compact button)

All paths land on: **Alex Mercer** case with full pipeline results and demo guide banner.

---

## 0:00–1:00 · Science engine (scroll: Genomic science review)

**Say:** "We built a deterministic 5-stage science pipeline — not an LLM."

| Stage | Point to |
|-------|----------|
| 1 Parse | 8/8 panel SNPs from 23andMe file |
| 2 Annotate | GLP1R, TCF7L2, PPARG, GIPR… gene symbols |
| 3 Match | Curated PubMed/DOI evidence KB |
| 4 Synthesize | **Concordant** nausea — patient reported + genetics agree |
| 5 Triggers | Split cadence, starting dose, monitoring rules |

All 5 stages are **expanded** in demo mode.

---

## 1:00–1:45 · Evidence depth

**Click:** Demo guide card **"Evidence depth"** (or click GLP1R row)

**Say:** "GLP1R rs10305492 — receptor-level variant. We cite mechanism, PMID, and prescribing actions. This is why we avoid a weekly peak in weeks 1–3."

---

## 1:45–2:30 · Clinical synthesis

**Click:** Demo guide **"Clinical synthesis"**

**Say:** "Composite side-effect profile merges genetics with intake symptoms. High-impact signals: GLP1R, TCF7L2, PPARG."

---

## 2:30–3:00 · Rx plan + sign-off

**Click:** Demo guide **"Rx plan + sign-off"**

**Say:** "Retatrutide split cadence, week-by-week titration, hold criteria. FDA CDS Class I — physician approves."

**Click:** **Approve & route** → show pharmacy JSON → **Transmission OK**

---

## If something breaks

- Re-click **Launch demo** on home (re-runs pipeline)
- Or open `/demo` directly

## Sample data files

- Intake: `lib/demo/demoIntake.ts` (Alex Mercer)
- Genomics: `fixtures/sample-23andme.txt` (8 curated SNPs)
