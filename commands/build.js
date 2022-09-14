import createBuilder from "../utils/builder.js"
import conf from "../utils/conf.js"
import loadIcmodConfig from "../utils/icmod_config.js"
import { finishState, setState, states } from "../utils/out.js"

/// Command to build .icmod file in debug or release mode
async function build(options) {
  try {
    const mode = options.release ? "release" : "debug"

    const icmod = loadIcmodConfig(process.cwd())
    conf.init(icmod.config.package.name)

    const builder = createBuilder(icmod, mode)

    for (let state of builder.build()) setState(state)
    for (let state of builder.bundle()) setState(state)
  } catch (e) {
    finishState()
    console.log(e)
  } finally {
    finishState()
  }
}

export default build
