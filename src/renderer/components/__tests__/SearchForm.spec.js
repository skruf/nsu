import { tests } from "@/utils"
import { shallowMount } from "@vue/test-utils"
import { Form, Input } from "element-ui"
import SearchForm from "@/components/SearchForm"

const localVue = tests.createVue([ Form, Input ])

describe("SearchForm", () => {
  it("renders the component", () => {
    const wrapper = shallowMount(SearchForm, { localVue })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a form and an input", () => {
    const wrapper = shallowMount(SearchForm, { localVue })
    expect(wrapper.find("el-form-stub").exists()).toBe(true)
    expect(wrapper.find("el-input-stub").exists()).toBe(true)
  })

  it("has correct placeholder", () => {
    const expectedValue = "This is a test placeholder"
    const propsData = { placeholder: expectedValue }
    const wrapper = shallowMount(SearchForm, { localVue, propsData })
    const input = wrapper.find("el-input-stub")
    const currentValue = input.attributes("placeholder")
    expect(currentValue).toBe(expectedValue)
  })

  it("sets value when typing", () => {
    const expectedValue = "this is a test"
    const wrapper = shallowMount(SearchForm, { localVue })
    const input = wrapper.find("el-input-stub")
    input.vm.$emit("input", expectedValue)
    expect(wrapper.emitted("input")[0][0]).toBe(expectedValue)
    expect(wrapper.vm.v).toBe(expectedValue)
  })

  it("submits form with value", () => {
    const expectedValue = "this is a test"
    const wrapper = shallowMount(SearchForm, { localVue })
    wrapper.vm.v = expectedValue
    wrapper.vm.submit()
    const emittedValue = wrapper.emitted("submit")[0][0]
    expect(emittedValue).toBe(expectedValue)
  })

  it("submits form when value is empty", () => {
    const expectedValue = ""
    const wrapper = shallowMount(SearchForm, { localVue })
    const input = wrapper.find("el-input-stub")
    input.vm.$emit("input", expectedValue)
    const emittedValue = wrapper.emitted("submit")[0][0]
    expect(emittedValue).toBe(expectedValue)
  })
})
