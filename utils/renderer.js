import { readFileSync, writeFileSync } from "fs"

export function renderFile(path, data) {
  let content = readFileSync(path).toString()

  Object.entries(data).forEach(([key, value]) => {
    content = content.replaceAll(new RegExp(`\{% ?${key} ?%\}`, "g"), value)
  })

  writeFileSync(path, content)
}
