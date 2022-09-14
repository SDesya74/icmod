import adb from "../utils/adb.js"
import { MODS_DIR, PACKS_DIR } from "../utils/constants.js"
import chalk from "chalk"
import conf from "../utils/conf.js"
import createBuilder from "../utils/builder.js"
import { error, finishState, setState, states } from "../utils/out.js"
import inquirer from "inquirer"
import loadIcmodConfig from "../utils/icmod_config.js"
import { join } from "path"

/// Command to build and push mod to device
async function run(options) {
  try {
    const mode = options.release ? "release" : "debug"

    let icmod = loadIcmodConfig(process.cwd())
    conf.init(icmod.config.package.name)

    const builder = createBuilder(icmod, mode)
    for (let state of builder.build()) setState(state)

    const device = conf.global.get("device")
    if (!device) {
      throw error(
        "Push Error",
        `device is not connected. Use \`${chalk.yellow(
          "icmod connect",
        )}\` before push`,
      )
    }

    setState(
      states.connect(
        ms => `to ${chalk.blue(device)} in ${(ms / 1000).toFixed(2)}s`,
      ),
    )

    let conn = await adb.connect(device)

    finishState()

    if (options.selectPack) conf.local.delete("pack")
    let pack = options.pack ?? conf.local.get("pack")
    if (!pack) {
      let packs = await conn.ls(PACKS_DIR)
      let { selection } = await inquirer.prompt([
        {
          type: "list",
          name: "selection",
          message: "In which pack are we going to push?",
          choices: packs,
        },
      ])
      pack = selection
    }

    conf.local.set("pack", pack)

    setState(
      states.push(ms => `to ${chalk.blue(pack)} in ${(ms / 1000).toFixed(2)}s`),
    )

    const target_path = join(PACKS_DIR, pack, MODS_DIR).replace(/\\/g, "/")

    await conn.push(builder.output, target_path)

    if (options.launch) {
      setState(states.run(ms => `in ${(ms / 1000).toFixed(2)}s`))
      await conn.launchHorizon(true)
    }
  } catch (e) {
    finishState()
    console.log(e)
  } finally {
    finishState()
  }
}

export default run
