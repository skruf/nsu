import createLocalVue from "@/utils/tests/createLocalVue"
import { shallowMount, mount } from "@vue/test-utils"
import { Breadcrumb, BreadcrumbItem, Button } from "element-ui"
import BreadcrumbBar from "@/components/BreadcrumbBar"

const localVue = createLocalVue([
  Breadcrumb,
  BreadcrumbItem,
  Button
])

describe("BreadcrumbBar", () => {
  it("should render the component", () => {
    const propsData = { paths: [] }

    const wrapper = shallowMount(BreadcrumbBar, { localVue, propsData })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a breadcrumb with breadcrumb items", () => {
    const propsData = {
      paths: [
        { to: "/ranges", label: "Ranges" },
        { to: "/ranges/all", label: "All" }
      ]
    }
    const wrapper = shallowMount(BreadcrumbBar, { localVue, propsData })
    expect(wrapper.find(Breadcrumb).exists()).toBe(true)
    expect(wrapper.findAll(BreadcrumbItem)).toHaveLength(2)
  })

  it("should have functioning prev / next buttons", () => {
    const propsData = {
      paths: [
        { to: "/ranges", label: "Ranges" },
        { to: "/ranges/all", label: "All" }
      ]
    }

    const mocks = {
      $router: {
        go: jest.fn()
      }
    }

    const wrapper = mount(BreadcrumbBar, { localVue, propsData, mocks })
    const buttons = wrapper.findAll(Button)

    buttons.at(0).trigger("click")
    buttons.at(1).trigger("click")

    expect(buttons).toHaveLength(2)

    expect(wrapper.vm.$router.go).toHaveBeenNthCalledWith(1, -1)
    expect(wrapper.vm.$router.go).toHaveBeenNthCalledWith(1, -1)
  })
})
