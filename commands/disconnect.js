import adb from "../utils/adb.js"

/// Disconnect from all devices
async function disconnect() {
  adb.disconnect()
}

export default disconnect
