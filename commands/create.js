const chalk = require("chalk")
const fs = require("fs")
const path = require("path")

/// Command to create new project
async function create(name, params) {
  let { type, features } = params

  let target_path = path.join(process.cwd(), name)
  let source_path = path.dirname(__dirname)

  if (fs.existsSync(target_path)) {
    console.log(
      chalk.red("Project Error") + `: Folder "${target_path}" is already exist.`
    )
    // TODO: Add confirmation to rewrite and --force param
    return
  }

  fs.mkdirSync(target_path, { recursive: true })

  let type_template = path.join(source_path, "templates", "types", type)

  fs.cpSync(type_template, target_path, {
    recursive: true,
  })

  // TODO: Add features

  // TODO: Render all template files

  // TODO: Add message with instructions what to do next
}

module.exports = create
