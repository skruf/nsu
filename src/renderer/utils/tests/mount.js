import { shallowMount, mount } from "@vue/test-utils"

export default (Component, localVue = {}, overrides = {}, deep = false) => {
  const fn = deep ? mount : shallowMount
  return fn(Component, { localVue, ...overrides })
}
