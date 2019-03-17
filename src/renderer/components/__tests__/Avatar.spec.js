import createLocalVue from "@/utils/tests/createLocalVue"
import { shallowMount } from "@vue/test-utils"
import Avatar from "@/components/Avatar"

const localVue = createLocalVue()

describe("Avatar", () => {
  it("renders the component", () => {
    const propsData = { firstName: "Ola", lastName: "Dunk" }
    const wrapper = shallowMount(Avatar, { localVue, propsData })
    expect(wrapper.text()).toBe("OD")
  })
})
