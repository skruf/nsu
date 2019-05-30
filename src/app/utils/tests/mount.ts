import Vue, { VueConstructor, FunctionalComponentOptions } from "vue"
import { shallowMount, mount } from "@vue/test-utils"
import { PropsDefinition } from "vue/types/options"

export default (
  Component: FunctionalComponentOptions<Record<string, any>, PropsDefinition<Record<string, any>>>,
  localVue: VueConstructor<Vue>,
  overrides?: {},
  deep = false
) => {
  const fn = deep ? mount : shallowMount
  return fn(Component, { localVue, ...overrides })
}
