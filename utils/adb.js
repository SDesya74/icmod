import adb_callback from "node-adb"
import { EOL } from "os"
import conf from "./conf.js"
import { join } from "path"
import {
  AUTOLAUNCH_FLAG,
  HORIZON_ACTIVITY,
  HORIZON_PACKAGE,
  HORIZON_DIR,
} from "./constants.js"
import { error } from "./out.js"

const adb = {
  port: conf.global.has("port") ? conf.global.get("port") : 5555, // TODO: Save port in conf
  async call(params) {
    return new Promise(r => adb_callback(params, r))
  },
  async devices() {
    const lines = (await adb.call({ shell: ["devices"] })).split(EOL)
    const device_lines = lines.slice(1, lines.length - 2)

    return device_lines.map(e => {
      const device = e.split("\t")
      return {
        id: device[0],
        type: device[1],
      }
    })
  },
  async connect(device_id) {
    let devices = await adb.devices()
    let device = devices.find(e => e.id == device_id && e.type !== "offline")

    if (!device && device_id.includes(":")) {
      await adb.call({ shell: ["connect", device_id] })
      devices = await adb.devices()
      device = devices.find(e => e.id == device_id && e.type !== "offline")
    }

    if (!device) {
      await adb.disconnect()
      throw error("ADB Error", `can't connect to device ${device_id}`)
    }

    conf.global.set("device", device.id)

    return device_handle(device.id)
  },
  async disconnect() {
    conf.global.delete("device")
    await adb.call({ shell: ["disconnect"] })
  },
}

function device_handle(id) {
  return {
    id,
    async push(from, to) {
      return new Promise(async resolve => {
        await adb.call({
          deviceID: id,
          shell: ["push", "--sync", "-z", "brotli", from, to],
        })
        resolve()
      })
    },
    async ls(path) {
      return new Promise(async resolve => {
        const lines = await adb.call({
          deviceID: id,
          shell: ["shell", "ls", path],
        })
        resolve(lines.split(EOL).slice(0, -1))
      })
    },
    async launchHorizon(autolaunch) {
      return new Promise(async resolve => {
        if (autolaunch) {
          await adb.call({
            deviceID: id,
            shell: [
              "shell",
              "touch",
              join(HORIZON_DIR, AUTOLAUNCH_FLAG).replace(/\\/g, "/"),
            ],
          })
        }

        // TODO: Force stop horizon before launching

        await adb.call({
          deviceID: id,
          shell: ["shell", "am", "force-stop", HORIZON_PACKAGE],
        })

        await adb.call({
          deviceID: id,
          shell: ["shell", "am", "start", "-n", HORIZON_ACTIVITY, "-W"],
        })

        resolve()
      })
    },
  }
}

export default adb
