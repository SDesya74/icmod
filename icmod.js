#! /usr/bin/env node

import { program } from "commander"

import create from "./commands/create.js"
import run from "./commands/run.js"
import connect from "./commands/connect.js"
import disconnect from "./commands/disconnect.js"
import build from "./commands/build.js"

program
  .command("new <name>")
  .description("Create a new project")
  .option("-t, --type <type>", "Type of new project (lib/mod)", "mod")
  .option(
    "-f, --features <features...>",
    "Included features (typescript, native, java)",
    [],
  )
  .option(
    "--force",
    "Will recreate the project, even if a folder with the same name exists",
  )
  .action(create)

program
  .command("run")
  .description("Run mod on device")
  .option("--no-launch")
  .option("--select-pack")
  .option("-p, --pack <pack>")
  .option("-r, --release", "Release build")
  .action(run)

program.command("connect").description("Connect to device").action(connect)

program
  .command("disconnect")
  .description("Disconnect from device")
  .action(disconnect)

program
  .command("build")
  .description("Build the project")
  .option("-r, --release", "Release build")
  .action(build)

program.parse()
