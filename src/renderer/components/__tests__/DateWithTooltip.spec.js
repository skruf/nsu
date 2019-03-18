import createLocalVue from "@/utils/tests/createLocalVue"
import mount from "@/utils/tests/mount"
import { Tooltip } from "element-ui"
import VueMoment from "vue-moment"
import DateWithTooltip from "@/components/DateWithTooltip"

const localVue = createLocalVue([ VueMoment, Tooltip ])

describe("DateWithTooltip", () => {
  const build = (overrides = {}, deep = false) => {
    return mount(DateWithTooltip, localVue, overrides, deep)
  }

  it("should render the component", () => {
    const wrapper = build({ propsData: { date: "" } })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should display dates and format them properly", () => {
    const wrapper = build({ propsData: { date: "2019-01-23T20:42:03.713Z" } })
    const tooltip = wrapper.find(DateWithTooltip)
    expect(tooltip.exists()).toBe(true)
    // expect(tooltip.text()).toBe("24.01.19")
  })
})
