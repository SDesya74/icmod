const adb = require("../utils/adb")

/// Disconnect from all devices
async function disconnect() {
  adb.disconnect()
}

module.exports = disconnect
