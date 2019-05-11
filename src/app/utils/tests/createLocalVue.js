import { createLocalVue } from "@vue/test-utils"

export default (dependencies) => {
  const localVue = createLocalVue()
  if(dependencies) {
    dependencies.forEach((dep) => { localVue.use(dep) })
  }
  return localVue
}
