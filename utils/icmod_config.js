import { existsSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { ICMOD_FILE } from "./constants.js"
import { parse } from "toml"
import { error } from "./out.js"
import merge from "deepmerge"

const defaultConfig = {
  build: {
    api: "CoreEngine",
    launcher: "launcher.js",
  },
}

function loadIcmodConfig(path) {
  while (!existsSync(join(path, ICMOD_FILE)) && path !== dirname(path))
    path = dirname(path)

  let icmod_file = join(path, ICMOD_FILE)
  if (!existsSync(icmod_file)) {
    throw error("Build Error", "icmod.toml is not found")
  }

  return {
    root: path,
    config: merge(defaultConfig, parse(readFileSync(icmod_file))),
  }
}

export default loadIcmodConfig
