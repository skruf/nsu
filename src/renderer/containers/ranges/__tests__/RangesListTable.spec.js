import { tests } from "@/utils"
import { shallowMount } from "@vue/test-utils"
import Vuex from "vuex"
import {
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
  Loading
} from "element-ui"
import SearchForm from "../../../components/SearchForm"
import RangesListTable from "../RangesListTable"

import { rangesFixture } from "@/fixtures"
import store from "../../../store/modules/ranges"
jest.mock("../../../store/modules/ranges")

const localVue = tests.createVue([
  Vuex,
  Table,
  TableColumn,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Button,
  Pagination,
  Loading.directive
])

describe("RangesListTable", () => {
  const build = () => {
    return shallowMount(RangesListTable, {
      localVue,
      store: new Vuex.Store({
        strict: true,
        modules: { ranges: store }
      })
    })
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("renders the component", () => {
    const wrapper = build()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it("should have a search form, table and pagination", () => {
    const wrapper = build()
    expect(wrapper.find(SearchForm).exists()).toBe(true)
    expect(wrapper.find("el-table-stub").exists()).toBe(true)
    expect(wrapper.find("el-pagination-stub").exists()).toBe(true)
  })

  it.only("should get a list of ranges", () => {
    const wrapper = build()
    expect(store.actions.listAsync).toHaveBeenCalled()
    expect(wrapper.vm.rangesList).toBe(rangesFixture)
  })

  it("should filter table by searching for a name", () => {
    const wrapper = build()
    wrapper.vm.rangesSetSearchFilter(rangesFixture[0].name)
    console.log(wrapper.vm.rangesSearchFilter)
  })
})
