import chalk from "chalk"
import ora from "ora"

const indent = s => " ".repeat(STATE_LENGTH - s.length) + s

export function error(name, message) {
  return `${chalk.red(indent(name))} ${message}`
}

export function info(name, message) {
  return `${chalk.blue(indent(name))} ${message}`
}

const STATE_LENGTH = 12
function state(progress_name, finish_name) {
  let spinner
  let start

  return message => ({
    log() {
      start = Date.now()
      spinner = ora(chalk.blue(indent(progress_name))).start()
    },
    finish() {
      const elapsed = Date.now() - start
      spinner.stopAndPersist({
        text: `${chalk.green(indent(finish_name))} ${
          typeof message === "string" ? message : message(elapsed)
        }`,
        symbol: "",
      })
    },
    reject(message) {
      const elapsed = Date.now() - start
      spinner.stopAndPersist({
        text: typeof message === "string" ? message : message(elapsed),
        symbol: "",
      })
    },
  })
}

export const states = {
  compile: state("Compiling", "Compiled"),
  bundle: state("Bundling", "Bundled"),
  push: state("Pushing", "Pushed"),
  connect: state("Connecting", "Connected"),
  run: state("Running", "Finished"),
  scan: state("Scanning", "Scanned"),
}

let current_state = null
export function setState(state) {
  current_state?.finish()
  current_state = state
  current_state.log()
}

export function finishState() {
  current_state?.finish()
  current_state = null
}

export function rejectState(message) {
  current_state?.reject(message)
  current_state = null
}
