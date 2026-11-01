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

console.log("==> 3. Compiling Go binary with embedded frontend...");
const goOutName = process.platform === "win32" ? "server.exe" : "server";
execSync(`go build -ldflags="-s -w" -o ${goOutName} .`, {
  cwd: path.resolve("backend"),
  stdio: "inherit",
});
console.log(`✓ Successfully built backend/${goOutName} with embedded static UI!`);

