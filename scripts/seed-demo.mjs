/**
 * Pre-seed the hackathon demo case (dev server must be running).
 * Usage: npm run dev   (in another terminal)
 *        npm run seed:demo
 */

const base = process.env.BASE_URL ?? "http://localhost:3000";

const res = await fetch(`${base}/api/demo/launch`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ force: true }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Seed failed:", data.error ?? res.statusText);
  console.error("Is the dev server running? Try: npm run dev");
  process.exit(1);
}

console.log(`Demo case ready: ${data.caseId}`);
console.log(`Open: ${base}/cases/${data.caseId}?demo=1`);
console.log(`Or:   ${base}/demo`);
