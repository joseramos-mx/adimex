#!/usr/bin/env node
// Falla si algún archivo bajo src/ contiene el marcador "[[PLACEHOLDER".
// Uso: npm run check:no-placeholders

import { execSync } from "node:child_process"

try {
  const result = execSync('git grep -n "\\[\\[PLACEHOLDER" -- src/', {
    encoding: "utf8",
  })
  if (result.trim()) {
    console.error(
      "build guard failed: quedan placeholders sin resolver en src/:\n" + result,
    )
    process.exit(1)
  }
} catch (err) {
  // git grep exit code 1 = no matches → todo OK.
  if (err && typeof err === "object" && "status" in err && err.status === 1) {
    process.exit(0)
  }
  console.error("build guard error:", err)
  process.exit(2)
}
console.log("OK: no quedan placeholders en src/")
