const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const toml = require("toml")

const ICMOD_FILE = "icmod.toml"
const OUTPUT_DIR = "dist"

/// Command to build .icmod file in debug or release mode
async function build(options) {
  let project_dir = process.cwd()
  while (
    !fs.existsSync(path.join(project_dir, ICMOD_FILE)) &&
    project_dir !== path.dirname(project_dir)
  )
    project_dir = path.dirname(project_dir)

  let icmod_file = path.join(project_dir, ICMOD_FILE)
  if (!fs.existsSync(icmod_file)) {
    console.log(chalk.red("Build Error") + `: icmod.toml not found`)
    return
  }

  let icmod = toml.parse(fs.readFileSync(icmod_file))

  const mode = options.release ? "release" : "debug"

  let dist_dir = join(project_dir, OUTPUT_DIR, mode)
  fs.mkdirSync(dist_dir, { recursive: true })

  // TODO: Create mod.info
  // TODO: Create build.config
  // TODO: Create includes
  // TODO: Copy resources
}

module.exports = build
