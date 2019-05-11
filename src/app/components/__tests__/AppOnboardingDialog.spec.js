import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
import { Dialog, Carousel, CarouselItem, Button } from "element-ui"
import AppOnboardingDialog from "~/components/AppOnboardingDialog"

const localVue = createLocalVue([ Dialog, Carousel, CarouselItem, Button ])

describe("AppOnboardingDialog", () => {
  const build = (deep = false, overrides = {}) => {
    return mount(AppOnboardingDialog, localVue, overrides, deep)
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("renders the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have elements", () => {
    const wrapper = build()
    expect(wrapper.find(Dialog).exists()).toBe(true)
    expect(wrapper.find(Carousel).exists()).toBe(true)
    expect(wrapper.find(CarouselItem).exists()).toBe(true)
    expect(wrapper.find(Button).exists()).toBe(true)
  })

  it("should be hidden by default", () => {
    const wrapper = build()
    expect(wrapper.vm.shown).toEqual(false)
  })

  it("should be able to close the dialog", () => {
    const wrapper = build(true)
    const button = wrapper.find(Button)
    button.trigger("click")
    const emittedValue = wrapper.emitted("update:shown")[0][0]
    expect(emittedValue).toBe(false)
    expect(wrapper.vm.visible).toBe(false)
  })

  it.skip("should watch shown prop", () => {
    const wrapper = build()
    wrapper.setData({ shown: true })
    expect(wrapper.vm.visible).toEqual(true)
  })
})
