import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
import Avatar from "~/components/Avatar"

const localVue = createLocalVue()

describe("Avatar", () => {
  const build = (deep = false, overrides = {}) => {
    return mount(Avatar, localVue, overrides, deep)
  }

  it("renders the component", () => {
    const wrapper = build(false, {
      propsData: { firstName: "Ola", lastName: "Dunk" }
    })
    expect(wrapper.text()).toBe("OD")
  })
})
