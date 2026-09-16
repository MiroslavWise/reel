import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"

const packageJsonUrl = new URL("../package.json", import.meta.url)
const packageJson = JSON.parse(readFileSync(packageJsonUrl, "utf8"))
const versionParts = packageJson.version.split(".").map(Number)

if (versionParts.length !== 3 || versionParts.some(Number.isNaN)) {
  throw new Error(`Invalid package version: ${packageJson.version}`)
}

versionParts[2] += 1
packageJson.version = versionParts.join(".")
writeFileSync(packageJsonUrl, `${JSON.stringify(packageJson, null, 2)}\n`)

const version = packageJson.version

execFileSync("git", ["add", "."], { stdio: "inherit" })
execFileSync("git", ["commit", "-m", version], { stdio: "inherit" })
execFileSync("git", ["push"], { stdio: "inherit" })
