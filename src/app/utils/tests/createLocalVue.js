import VueTestUtils, { createLocalVue } from "@vue/test-utils"
VueTestUtils.config.mocks.$t = (key) => key

export default (dependencies) => {
  const localVue = createLocalVue()
  if(dependencies) {
    dependencies.forEach((dep) => { localVue.use(dep) })
  }
  return localVue
}
