import createLocalVue from "@/utils/tests/createLocalVue"
import { Breadcrumb, BreadcrumbItem, Button } from "element-ui"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import mount from "@/utils/tests/mount"

const localVue = createLocalVue([ Breadcrumb, BreadcrumbItem, Button ])

describe("BreadcrumbBar", () => {
  const build = (overrides = {}, deep = false) => {
    return mount(BreadcrumbBar, localVue, overrides, deep)
  }

  it("should render the component", () => {
    const wrapper = build({ propsData: { paths: [] } })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a breadcrumb with breadcrumb items", () => {
    const wrapper = build({
      propsData: {
        paths: [
          { to: "/ranges", label: "Ranges" },
          { to: "/ranges/all", label: "All" }
        ]
      }
    })
    expect(wrapper.find(Breadcrumb).exists()).toBe(true)
    expect(wrapper.findAll(BreadcrumbItem)).toHaveLength(2)
  })

  it("should have functioning prev / next buttons", () => {
    const wrapper = build({
      propsData: {
        paths: [
          { to: "/ranges", label: "Ranges" },
          { to: "/ranges/all", label: "All" }
        ]
      },
      mocks: {
        $router: { go: jest.fn() }
      }
    }, true)

    const buttons = wrapper.findAll(Button)

    buttons.at(0).trigger("click")
    buttons.at(1).trigger("click")

    expect(buttons).toHaveLength(2)

    expect(wrapper.vm.$router.go).toHaveBeenNthCalledWith(1, -1)
    expect(wrapper.vm.$router.go).toHaveBeenNthCalledWith(1, -1)
  })
})
