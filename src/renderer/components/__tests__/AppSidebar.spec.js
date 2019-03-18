import createLocalVue from "@/utils/tests/createLocalVue"
import mount from "@/utils/tests/mount"
import { Aside, Menu, Submenu, MenuItem, Button } from "element-ui"
import AppSidebar from "@/components/AppSidebar"

const localVue = createLocalVue([ Aside, Menu, Submenu, MenuItem, Button ])

describe("AppSidebar", () => {
  const build = (overrides = {}, deep = false) => {
    return mount(AppSidebar, localVue, overrides, deep)
  }

  // beforeEach(() => {
  //   jest.resetAllMocks()
  // })

  it("renders the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a form and an input", () => {
    const wrapper = build()
    expect(wrapper.find(Aside).exists()).toBe(true)
    expect(wrapper.find(Menu).exists()).toBe(true)
    expect(wrapper.find(Submenu).exists()).toBe(true)
    expect(wrapper.find(MenuItem).exists()).toBe(true)
    expect(wrapper.find(Button).exists()).toBe(true)
  })
})
