import { Aside, Menu, Submenu, MenuItem, Button } from "element-ui"
import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
import AppSidebar from "~/components/AppSidebar"

const localVue = createLocalVue([ Aside, Menu, Submenu, MenuItem, Button ])

describe("AppSidebar", () => {
  const build = (deep = false, overrides = {}) => {
    return mount(AppSidebar, localVue, overrides, deep)
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should render the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have elements", () => {
    const wrapper = build()
    expect(wrapper.find(Aside).exists()).toBe(true)
    expect(wrapper.find(Menu).exists()).toBe(true)
    expect(wrapper.find(Submenu).exists()).toBe(true)
    expect(wrapper.find(MenuItem).exists()).toBe(true)
    expect(wrapper.find(Button).exists()).toBe(true)
  })

  it("should be open by default", () => {
    const wrapper = build()
    expect(wrapper.vm.isOpen).toEqual(true)
  })

  it("should be able to open sidebar", () => {
    const wrapper = build(true)
    const button = wrapper.find(Button)
    button.trigger("click")
    const emittedValue = wrapper.emitted("update:open")[0][0]
    expect(emittedValue).toBe(false)
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it("should be able to navigate", () => {
    const wrapper = build(true, {
      mocks: { $router: { push: jest.fn() } }
    })
    const menuItem = wrapper.find(MenuItem)
    menuItem.trigger("click")
    expect(wrapper.vm.$router.push).toHaveBeenCalled()
  })

  it.skip("should watch open prop", () => {
    const wrapper = build()
    wrapper.setData({ open: false })
    expect(wrapper.vm.isOpen).toEqual(false)
  })
})
