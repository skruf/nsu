import createLocalVue from "~/utils/tests/createLocalVue"
import mount from "~/utils/tests/mount"
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
import SearchForm from "~/components/SearchForm"
import RangesListTable from "~/containers/RangesListTable"

import { rangesFixture } from "~/fixtures"
import rangesStore from "~/state/stores/ranges.store"
jest.mock("~/state/stores/ranges.store")

const localVue = createLocalVue([
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
  const build = (deep = false, overrides = {}) => {
    const cfg = {
      store: new Vuex.Store({
        strict: true,
        modules: { ranges: rangesStore }
      }),
      ...overrides
    }
    return mount(RangesListTable, localVue, cfg, deep)
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("should render the component", () => {
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
    wrapper.vm.rangesActionsSetSearchFilter()
    expect(rangesStore.actions.list).toHaveBeenCalled()
  })
})
