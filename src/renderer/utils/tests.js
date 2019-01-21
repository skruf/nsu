import { createLocalVue } from "@vue/test-utils"

const createVue = (dependencies) => {
  const localVue = createLocalVue()
  if(dependencies) {
    dependencies.forEach((dep) => { localVue.use(dep) })
  }
  return localVue
}

export default {
  createVue
}
