const adb_callback = require("node-adb")
const os = require("os")
const conf = new (require("conf"))()
const chalk = require("chalk")
const { resolve } = require("path")

const adb = {
  port: 5555, // TODO: Save in conf
  async call(params) {
    return new Promise((r) => adb_callback(params, r))
  },
  async devices() {
    const lines = (await adb.call({ shell: ["devices"] })).split(os.EOL)
    const device_lines = lines.slice(1, lines.length - 2)

    return device_lines.map((e) => {
      const device = e.split("\t")
      return {
        id: device[0],
        type: device[1],
      }
    })
  },
  async connect(device_id) {
    if (device_id.includes(":")) {
      await adb.call({ shell: ["connect", device_id] })
    }

    let devices = await adb.devices()
    let device = devices.find((e) => e.id == device_id)

    if (!device) {
      await adb.disconnect()
      throw `can't connect to device ${device_id}`
    }

    conf.set("device", device.id)
    console.log(`Connected to ${chalk.green(device.id)}`)

    return device_handle(device.id)
  },
  async disconnect() {
    conf.delete("device")
    await adb.call({ shell: ["disconnect"] })
  },
}

function device_handle(id) {
  return {
    id,
    async push(from, to) {
      // TODO
    },
    async ls(path) {
      return new Promise(async (resolve) => {
        const lines = await adb.call({
          deviceID: id,
          shell: ["shell", "ls", path],
        })
        resolve(lines.split(os.EOL).slice(0, -1))
      })
    },
  }
}

module.exports = adb
