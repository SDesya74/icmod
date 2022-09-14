import chalk from "chalk"
import { existsSync, rmSync, mkdirSync, cpSync } from "fs"
import { join, dirname } from "path"
import { ICMOD_FILE } from "../utils/constants.js"
import { renderFile } from "../utils/renderer.js"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/// Command to create new project
async function create(name, options) {
  let { type, features } = options

  let target_path = join(process.cwd(), name)
  let source_path = dirname(__dirname)

  if (existsSync(target_path) && !options.force) {
    console.log(
      chalk.red("Project Error") +
        `: Folder "${target_path}" is already exist.`,
    )
    // TODO: Add confirmation to rewrite existing project
    return
  }

  rmSync(target_path, { recursive: true, force: true })

  mkdirSync(target_path, { recursive: true })

  let type_template = join(source_path, "templates", "types", type)

  cpSync(type_template, target_path, {
    recursive: true,
  })

  // TODO: Add features

  let icmod_file = join(target_path, ICMOD_FILE)
  renderFile(icmod_file, {
    name,
    version: "0.1",
  })

  // TODO: Add message with instructions what to do next
}

export default create
