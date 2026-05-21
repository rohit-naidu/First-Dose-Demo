import { execSync, spawn } from "node:child_process";

const port = process.env.PORT ?? "3000";

/**
 * Finds any process currently listening on the demo port.
 *
 * Why this exists:
 * Next.js can leave a child dev-server process running after a manual restart.
 * When that happens, the next `npm run dev` tries to use port 3001 instead.
 * This helper keeps the demo predictable by always freeing port 3000 first.
 */
function findPortPids() {
  try {
    return execSync(`lsof -ti tcp:${port}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
      .split(/\s+/)
      .filter(Boolean)
      .filter((pid) => pid !== String(process.pid));
  } catch {
    return [];
  }
}

/**
 * Stops existing processes on the target port before starting Next.
 *
 * SIGTERM asks the old dev server to shut down cleanly. If a process is already
 * gone, Node throws an ESRCH error, which is safe to ignore.
 */
function freePort() {
  const pids = findPortPids();

  for (const pid of pids) {
    try {
      process.kill(Number(pid), "SIGTERM");
      console.log(`Stopped existing dev server process ${pid} on port ${port}.`);
    } catch (error) {
      if (error?.code !== "ESRCH") {
        throw error;
      }
    }
  }
}

function startNextDev() {
  const nextDev = spawn("next", ["dev", "--port", port], {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  process.on("SIGINT", () => nextDev.kill("SIGINT"));
  process.on("SIGTERM", () => nextDev.kill("SIGTERM"));

  nextDev.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });
}

freePort();
startNextDev();
