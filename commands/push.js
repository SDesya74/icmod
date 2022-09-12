const adb = require("../utils/adb")
const conf = new (require("conf"))()
const chalk = require("chalk")

const PACKS_DIRECTORY = "/sdcard/games/horizon/packs"

// Command to build and push mod to device
// TODO: Add --pack parameter
// TODO: Add --select-pack parameter
async function push(options) {
  const device = conf.get("device")

  if (!device) {
    console.log(
      `${chalk.red(
        "Pushing error"
      )}: the device is not connected, Use \`${chalk.yellow(
        "icmod connect"
      )}\` to connect to it`
    )
    return
  }

  let conn = await adb.connect(device)

  let selected_pack = options.pack ?? conf.get("pack")

  if (options.selectPack) {
    const inquirer = (await import("inquirer")).default // TODO: Remove dynamic import
    let packs = await conn.ls(PACKS_DIRECTORY)
    let { pack } = await inquirer.prompt([
      {
        type: "list",
        name: "pack",
        message: "In which pack do we push?",
        choices: packs,
      },
    ])
    selected_pack = pack
  }

  conf.set("pack", selected_pack)
  console.log({ selected_pack })
}

module.exports = push
