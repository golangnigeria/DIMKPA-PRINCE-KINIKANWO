import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const isWin = process.platform === "win32";
const binaryName = isWin ? "server.exe" : "server";
const binaryPath = path.resolve("backend", binaryName);

// Ensure executable permissions on Linux
if (!isWin && fs.existsSync(binaryPath)) {
  try {
    fs.chmodSync(binaryPath, 0o755);
  } catch {
    // Ignore permission error if already executable
  }
}

const child = spawn(isWin ? binaryName : `./${binaryName}`, [], {
  cwd: path.resolve("backend"),
  stdio: "inherit",
  shell: true,
  env: process.env,
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
