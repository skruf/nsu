import { createLocalVue, config } from "@vue/test-utils"
import { PluginObject } from "vue"
config.mocks.$t = (key: string): string => key

export default (dependencies: PluginObject<any>[]) => {
  const localVue = createLocalVue()
  if(dependencies) {
    dependencies.forEach((dep) => {
      localVue.use(dep)
    })
  }
  return localVue
}
