import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

console.log("==> 1. Building Next.js static export...");
execSync("npx next build", { stdio: "inherit" });

console.log("==> 2. Copying out/ to backend/dist...");
const outDir = path.resolve("out");
const distDir = path.resolve("backend/dist");

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.cpSync(outDir, distDir, { recursive: true });
console.log("✓ Successfully copied static frontend to backend/dist");

console.log("==> 3. Verifying Go backend binary...");
let hasGo = false;
try {
  execSync("go version", { stdio: "ignore" });
  hasGo = true;
} catch {
  // Go not installed in environment
}

if (hasGo) {
  const isWin = process.platform === "win32";
  const goOutName = isWin ? "server.exe" : "server";
  console.log(`Compiling backend/${goOutName} with Go compiler...`);
  execSync(`go build -ldflags="-s -w" -o ${goOutName} .`, {
    cwd: path.resolve("backend"),
    stdio: "inherit",
  });
  console.log(`✓ Successfully compiled backend/${goOutName}`);
} else {
  const binaryPath = path.resolve("backend", "server");
  if (fs.existsSync(binaryPath)) {
    console.log("✓ Found precompiled Linux binary at backend/server - ready for production deployment!");
  } else {
    throw new Error("Go compiler not found and no precompiled backend/server binary found!");
  }
}
