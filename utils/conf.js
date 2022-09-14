import Config from "conf"

const global = new Config({
  projectName: "icmod",
})
let local
export default {
  get global() {
    return global
  },
  get local() {
    return local
  },
  init(project_name) {
    local = new Config({
      projectName: `icmod-${project_name}`,
    })
  },
}
