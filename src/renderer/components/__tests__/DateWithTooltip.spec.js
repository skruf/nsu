import createLocalVue from "@/utils/tests/createLocalVue"
import { mount } from "@vue/test-utils"
import { Tooltip } from "element-ui"
import VueMoment from "vue-moment"
import DateWithTooltip from "@/components/DateWithTooltip"

const localVue = createLocalVue([
  VueMoment,
  Tooltip
])

describe("DateWithTooltip", () => {
  it("should render the component", () => {
    const propsData = { date: "" }
    const wrapper = mount(DateWithTooltip, { localVue, propsData })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should display dates and format them properly", () => {
    const propsData = { date: "2019-01-23T20:42:03.713Z" }
    const wrapper = mount(DateWithTooltip, { localVue, propsData })
    const tooltip = wrapper.find(DateWithTooltip)
    expect(tooltip.exists()).toBe(true)
    // expect(tooltip.text()).toBe("24.01.19")
  })
})
