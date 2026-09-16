import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm"

execFileSync(npmCommand, ["version", "patch", "--no-git-tag-version"], {
  stdio: "inherit",
})

const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"))
const version = packageJson.version

execFileSync("git", ["add", "."], { stdio: "inherit" })
execFileSync("git", ["commit", "-m", version], { stdio: "inherit" })
execFileSync("git", ["push"], { stdio: "inherit" })