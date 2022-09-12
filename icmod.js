#! /usr/bin/env node

const { program } = require("commander")

const create = require("./commands/create")
const push = require("./commands/push")
const connect = require("./commands/connect")
const disconnect = require("./commands/disconnect")
const build = require("./commands/build")

program
  .command("new <name>")
  .description("Create a new project")
  .option("-t, --type <type>", "Type of new project (lib/mod)", "mod")
  .option(
    "-f, --features <features...>",
    "Included features (typescript, native, java)",
    []
  )
  .action(create)

program
  .command("push")
  .description("Push mod to device")
  .option("--no-launch")
  .option("--select-pack")
  .option("-p, --pack")
  .option("--release", "Release build")
  .action(push)

program.command("connect").description("Connect to device.").action(connect)

program
  .command("disconnect")
  .description("Disconnect from device.")
  .action(disconnect)

program
  .command("build")
  .description("Build the project")
  .option("--release", "Release build")
  .action(build)

program.parse()
