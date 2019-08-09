import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
import Element, { Form, Input } from "element-ui"
import SearchForm from "~/components/SearchForm"

const localVue = createLocalVue([ Element ])

const build = (deep = false, overrides = {}) => {
  return mount(SearchForm, localVue, overrides, deep)
}

describe("SearchForm", () => {
  it("should render the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a form and an input", () => {
    const wrapper = build()
    expect(wrapper.find(Form).exists()).toBe(true)
    expect(wrapper.find(Input).exists()).toBe(true)
  })

  it("has correct placeholder", () => {
    const expectedValue = "This is a test placeholder"
    const wrapper = build(false, {
      propsData: { placeholder: expectedValue }
    })
    const input = wrapper.find(Input)
    const currentValue = input.attributes("placeholder")
    expect(currentValue).toBe(expectedValue)
  })

  it("sets value when typing", () => {
    const expectedValue = "this is a test"
    const wrapper = build()
    const input = wrapper.find(Input)
    input.vm.$emit("input", expectedValue)
    expect(wrapper.emitted("input")[0][0]).toBe(expectedValue)
    expect(wrapper.vm.v).toBe(expectedValue)
  })

  it("submits form with value", () => {
    const expectedValue = "this is a test"
    const wrapper = build()
    wrapper.vm.v = expectedValue
    wrapper.vm.submit()
    const emittedValue = wrapper.emitted("submit")[0][0]
    expect(emittedValue).toBe(expectedValue)
  })

  it("submits form when value is empty", () => {
    const expectedValue = ""
    const wrapper = build()
    const input = wrapper.find(Input)
    input.vm.$emit("input", expectedValue)
    const emittedValue = wrapper.emitted("submit")[0][0]
    expect(emittedValue).toBe(expectedValue)
  })
})
