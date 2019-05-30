import VueRouter from "vue-router"
import Element from "element-ui"
import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
import AppOnboardingDialog from "~/components/AppOnboardingDialog"
import AppSidebar from "~/components/AppSidebar"
import App from "~/App"

const localVue = createLocalVue([ VueRouter, Element ])

const build = (deep = false, overrides = {}) => {
  return mount(App, localVue, overrides, deep)
}

Storage.prototype.setItem = jest.fn().mockResolvedValue(true)

describe("App", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should render the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have sidebar and onboarding", () => {
    const wrapper = build()
    expect(wrapper.find(AppOnboardingDialog).exists()).toBe(true)
    expect(wrapper.find(AppSidebar).exists()).toBe(true)
  })

  it("should display sidebar and onboarding by default", () => {
    const wrapper = build()
    expect(wrapper.vm.$data.isSidebarOpen).toEqual(true)
    expect(wrapper.vm.$data.appOnboardingShowDialog).toEqual(true)
  })

  it("should store display state of sidebar and onboarding", () => {
    const wrapper = build()
    wrapper.setData({
      isSidebarOpen: false,
      appOnboardingShowDialog: false
    })
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "isSidebarOpen", false
    )
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "appOnboardingShowDialog", false
    )
  })
})
