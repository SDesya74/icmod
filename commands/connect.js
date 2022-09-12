const adb = require("../utils/adb")
const conf = new (require("conf"))()
const chalk = require("chalk")

async function connect() {
  const inquirer = (await import("inquirer")).default // TODO: Remove dynamic import

  let devices = await adb.devices()

  if (devices.length == 1) {
    const device = devices[0]
    // let { connect } = await inquirer.prompt([
    //   {
    //     type: "confirm",
    //     name: "connect",
    //     message: `Should I connect to ${device.id}?`,
    //   },
    // ])
    // if (connect) {
    await adb.connect(device.id)
    // }
    return
  } else if (devices.length == 0) {
    let { method } = await inquirer.prompt([
      {
        type: "list",
        name: "method",
        message: "It seems your device is not connected with a cable.",
        choices: [
          {
            name: "I connected the device, let's try again",
            value: "usb",
          },
          {
            name: "Connect via Wi-Fi",
            value: "wifi",
          },
        ],
      },
    ])

    if (method == "usb") {
      return await connect()
    } else if (method == "wifi") {
      // TODO: Remember last entered IP
      let { address } = await inquirer.prompt([
        {
          type: "input",
          name: "address",
          message: "Enter the IP-address of your device (e.g. 192.168.1.1)",
          default: conf.get("ip"),
        },
      ])

      conf.set("ip", address)

      // TODO: Ask for port
      // TODO: Check that IP is IP

      await adb.connect(`${address}:${adb.port}`)
    }

    return
  }

  let { device } = await inquirer.prompt([
    {
      type: "list",
      name: "device",
      message: "Which device should I connect to?",
      choices: devices.map((e) => {
        return {
          name: `${e.id}\t${e.type}`,
          value: e,
        }
      }),
    },
  ])

  await adb.connect(device.id)
}

module.exports = connect
