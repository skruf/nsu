import createLocalVue from "@/utils/tests/createLocalVue"
import mount from "@/utils/tests/mount"
import Vuex from "vuex"
import {
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Button,
  Loading
} from "element-ui"
import RangesCreateDialog from "@/containers/RangesCreateDialog"
import { rangesStub } from "@/stubs"
import { rangesFixture } from "@/fixtures"
import rangesStore from "@/state/stores/ranges.store"
jest.mock("@/state/stores/ranges.store")

const localVue = createLocalVue([
  Vuex,
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Button,
  Loading.directive
])

describe("RangesCreateDialog", () => {
  const build = (deep = false, overrides = {}) => {
    const cfg = {
      store: new Vuex.Store({
        strict: true,
        modules: { ranges: rangesStore }
      }),
      ...overrides
    }
    return mount(RangesCreateDialog, localVue, cfg, deep)
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("renders the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a dialog with form and buttons", () => {
    const wrapper = build()
    expect(wrapper.find(Dialog).exists()).toBe(true)
    expect(wrapper.find(Form).exists()).toBe(true)
    expect(wrapper.find(Button).exists()).toBe(true)
  })

  it("should validate on form submit", () => {
    const wrapper = build()
    wrapper.vm.$refs.form.validate = jest.fn()
    wrapper.vm.submit()
    expect(wrapper.vm.$refs.form.validate).toHaveBeenCalled()
  })

  it("should be able to clear the form", () => {
    const wrapper = build()
    wrapper.vm.form = { name: "Test" }
    wrapper.vm.clear()
    expect(wrapper.vm.form).toEqual(rangesStub)
  })

  it("should be able to create a range", async () => {
    const wrapper = build()
    wrapper.vm.form = { ...rangesFixture[0] }
    await wrapper.vm.rangesActionsCreate()
    expect(rangesStore.actions.create).toHaveBeenCalled()
  })

  it("should be able to open the dialog", async () => {
    const wrapper = build(false, {
      propsData: { shown: true }
    })
    expect(wrapper.vm.visible).toEqual(true)
  })

  it("should be able to close the dialog", async () => {
    const wrapper = build()
    wrapper.vm.close()
    expect(wrapper.vm.visible).toEqual(false)
    const emittedValue = wrapper.emitted("update:shown")[0][0]
    expect(emittedValue).toBe(false)
  })
})
