import adb from "../utils/adb.js"
import conf from "../utils/conf.js"
import chalk from "chalk"
import {
  finishState,
  setState,
  states,
  error,
  info,
  rejectState,
} from "../utils/out.js"
import inquirer from "inquirer"
import ip from "ip"
import { isIPv4 } from "is-ip"
import Scanner from "ping-scanner"

// TODO: Add --mode flag to skip selection
async function connect() {
  try {
    let devices = await adb.devices()

    if (devices.length == 1) {
      const device = devices[0]

      setState(
        states.connect(
          ms => `to ${chalk.blue(device.id)} in ${(ms / 1000).toFixed(2)}s`,
        ),
      )
      await adb.connect(device.id)
      finishState()
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
              name: "I know IP of my device, so let's use Wi-Fi",
              value: "wifi",
            },
            {
              name: "Scan my Wi-Fi network and connect to something",
              value: "scan",
            },
          ],
        },
      ])

      if (method == "usb") {
        return await connect()
      } else if (method == "wifi") {
        let { ip } = await inquirer.prompt([
          {
            type: "input",
            name: "ip",
            message: "Enter the IP-address of your device (e.g. 192.168.1.1)",
            default: conf.global.get("ip"),
          },
        ])
        const port = await askForPort()

        if (!isIPv4(ip)) throw error("Input Error", `\`${ip}\` is not IPv4`)

        conf.global.set("ip", ip)
        adb.port = port

        const address = `${ip}:${port}`
        setState(
          states.connect(
            ms => `to ${chalk.blue(address)} in ${(ms / 1000).toFixed(2)}s`,
          ),
        )
        await adb.connect(address)
        finishState()
      } else if (method == "scan") {
        const addr = ip.address()
        const cidr = addr.slice(0, addr.lastIndexOf(".")) + ".0/24"

        setState(states.scan(ms => `in ${(ms / 1000).toFixed(2)}s`))
        const scanner = new Scanner({
          networks: [cidr],
        })
        const ips = Array.from((await scanner.scan()).entries())
          .filter(([_, v]) => v)
          .map(([k]) => k)
          .filter(v => v !== addr) // it makes no sense to connect to a local machine

        finishState()

        // select ip from list or try to connect to each
        const { selected_ip } = await inquirer.prompt([
          {
            type: "list",
            name: "selected_ip",
            message: "Which IP should I connect?",
            choices: [
              ...ips,
              new inquirer.Separator(),
              {
                name: "idk, try each!",
                value: "each",
              },
            ],
          },
        ])

        // select port which to connect
        const port = await askForPort()

        if (selected_ip === "each") {
          // TODO: parallelize
          for (let ip of ips) {
            const address = `${ip}:${port}`
            try {
              setState(
                states.connect(
                  ms =>
                    `to ${chalk.blue(address)} in ${(ms / 1000).toFixed()}s`,
                ),
              )
              await adb.connect(address)
              return
            } catch {
              rejectState(ms =>
                info(
                  "Info",
                  `tried ${chalk.blue(ip)} in ${(ms / 1000).toFixed()}s`,
                ),
              )
            } finally {
              finishState()
            }
          }
        } else {
          const address = `${selected_ip}:${port}`
          setState(
            states.connect(
              ms => `to ${chalk.blue(address)} in ${(ms / 1000).toFixed()}s`,
            ),
          )
          await adb.connect(address)
        }
      }
      return
    }

    let { device } = await inquirer.prompt([
      {
        type: "list",
        name: "device",
        message: "Which should I connect to?",
        choices: devices.map(e => {
          return {
            name: `${e.id}\t${e.type}`,
            value: e,
          }
        }),
      },
    ])

    setState(
      states.connect(
        ms => `to ${chalk.blue(device.id)} in ${(ms / 1000).toFixed(2)}s`,
      ),
    )
    await adb.connect(device.id)
  } catch (e) {
    finishState()
    console.log(e)
  } finally {
    finishState()
  }
}

async function askForPort() {
  const { port } = await inquirer.prompt([
    {
      type: "number",
      name: "port",
      message: "Enter port (leave default if you are not sure)",
      default: adb.port,
    },
  ])

  if (port <= 4096)
    throw error("Input Error", `\`${port}\` is not valid port, try 5555`)

  return port
}

export default connect
