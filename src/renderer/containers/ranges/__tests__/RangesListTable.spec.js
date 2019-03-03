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
import SearchForm from "@/components/SearchForm"
import RangesListTable from "@/containers/ranges/RangesListTable"

import { rangesFixture } from "@/fixtures"
import rangesStore from "@/state/stores/ranges.store"
jest.mock("@/state/stores/ranges.store")

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
        modules: { ranges: rangesStore }
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
    expect(wrapper.find(Table).exists()).toBe(true)
    expect(wrapper.find(Pagination).exists()).toBe(true)
  })

  it("should get a list of ranges", () => {
    const wrapper = build()
    expect(rangesStore.actions.list).toHaveBeenCalled()
    expect(wrapper.vm.rangesStateList).toBe(rangesFixture)
  })

  it("should filter table by searching for a name", () => {
    const wrapper = build()
    wrapper.vm.rangesMutationsSetSearchFilter(rangesFixture[0].name)
    expect(rangesStore.mutations.SET_SEARCH_FILTER).toHaveBeenCalled()
  })
})
