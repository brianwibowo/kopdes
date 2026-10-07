const { mkdtempSync, rmSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const directory = mkdtempSync(path.join(tmpdir(), "kopdes-model-test-"));
try {
  const compile = spawnSync(
    process.execPath,
    [
      require.resolve("typescript/bin/tsc"),
      "src/features/modelling/model.ts",
      "src/features/modelling/exports.ts",
      "--outDir",
      directory,
      "--rootDir",
      "src",
      "--target",
      "ES2022",
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--esModuleInterop",
      "--skipLibCheck",
      "--strict",
    ],
    { stdio: "inherit" },
  );
  if (compile.status !== 0) process.exitCode = compile.status || 1;
  else {
    const tests = spawnSync(
      process.execPath,
      ["--test", "tests/model.test.cjs"],
      { stdio: "inherit", env: { ...process.env, KOPDES_TEST_DIR: directory } },
    );
    process.exitCode = tests.status ?? 1;
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
