import flushPromises from "flush-promises"
import { rangesStore } from "@/state/stores"
import { rangesFixture } from "@/fixtures"
import { rangesService } from "@/services"

jest.mock("@/services/ranges.service")

describe("ranges.store", () => {
  const commit = jest.fn()
  const dispatch = jest.fn()
  const initialState = { ...rangesStore.state }

  afterEach(() => {
    jest.clearAllMocks()
    rangesStore.state = { ...initialState }
  })

  it("[mutations] should set the list and count of ranges", () => {
    const { mutations, state } = rangesStore

    mutations.SET_LIST(state, rangesFixture)
    mutations.SET_COUNT(state, rangesFixture.length)

    expect(state.list).toEqual(rangesFixture)
    expect(state.count).toBe(rangesFixture.length)
  })

  it("[actions] should list ranges", async () => {
    const { actions, state } = rangesStore

    const res = await actions.list({ commit, state })
    await flushPromises()

    expect(rangesService.list).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_LIST_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "SET_LIST", rangesFixture)
    expect(commit).toHaveBeenNthCalledWith(3, "SET_COUNT", rangesFixture.length)
    expect(commit).toHaveBeenNthCalledWith(4, "SET_LIST_LOADING", false)
    expect(res.items).toEqual(rangesFixture)
    expect(res.count).toEqual(rangesFixture.length)
  })

  it("[mutations] should set list filter", async () => {
    const { mutations, state } = rangesStore
    const filter = { id: "123" }

    mutations.SET_LIST_FILTER(state, filter)
    expect(state.listFilter).toEqual(filter)
  })

  it("[actions] should list with filter", async () => {
    const { mutations, state, actions } = rangesStore
    const filter = { id: "123" }

    mutations.SET_LIST_FILTER(state, filter)
    await actions.list({ commit, state })
    await flushPromises()

    expect(rangesService.list).toHaveBeenCalledWith(filter, expect.anything())
  })

  it("[mutations] should be able to set asc/desc sorting", async () => {
    const { mutations, state } = rangesStore
    const sortBy = "area"

    expect(state.sortBy).toBe("-createdAt")
    mutations.SET_SORTING(state, { prop: sortBy })
    expect(state.sortBy).toBe(sortBy)
    mutations.SET_SORTING(state, { prop: sortBy, order: "ascending" })
    expect(state.sortBy).toBe(`-${sortBy}`)
  })

  it("[actions] should be able to change sorting", async () => {
    const { actions, state } = rangesStore
    const sortBy = "area"

    await actions.setSorting({ commit, state, dispatch }, sortBy)
    await flushPromises()

    expect(commit).toHaveBeenNthCalledWith(1, "SET_SORTING", sortBy)
    expect(dispatch).toHaveBeenNthCalledWith(1, "list")
  })

  it("[mutations] should be able to set search filter", async () => {
    const { mutations, state } = rangesStore
    const search = "test"

    mutations.SET_SEARCH_FILTER(state, search)
    expect(state.searchFilterValue).toBe(search)
    expect(state.pageCurrent).toBe(1)
  })

  it("[actions] should be able to search for a range", async () => {
    const { actions, state } = rangesStore
    const search = "area"

    await actions.setSearchFilter({ commit, state, dispatch }, search)
    await flushPromises()

    expect(commit).toHaveBeenNthCalledWith(1, "SET_SEARCH_FILTER", search)
    expect(dispatch).toHaveBeenNthCalledWith(1, "list")
  })

  it("[mutations] should be able to set pagination", async () => {
    const { mutations, state } = rangesStore
    const pageSize = 30
    const pageCurrent = 2

    expect(state.pageSize).toBe(15)
    expect(state.pageCurrent).toBe(1)
    mutations.SET_PAGE_SIZE(state, pageSize)
    expect(state.pageSize).toBe(pageSize)
    mutations.SET_PAGE_CURRENT(state, pageCurrent)
    expect(state.pageCurrent).toBe(pageCurrent)
  })

  it("[actions] should be able to change pagination", async () => {
    const { actions, state } = rangesStore
    const pageSize = 30
    const pageCurrent = 2

    await actions.setPageSize({ commit, state, dispatch }, pageSize)
    await actions.setPageCurrent({ commit, state, dispatch }, pageCurrent)
    await flushPromises()

    expect(commit).toHaveBeenNthCalledWith(1, "SET_PAGE_SIZE", pageSize)
    expect(commit).toHaveBeenNthCalledWith(2, "SET_PAGE_CURRENT", pageCurrent)
    expect(dispatch).toHaveBeenNthCalledWith(1, "list")
    expect(dispatch).toHaveBeenNthCalledWith(2, "list")
  })

  it("[mutations] should set a selected range", async () => {
    const { mutations, state } = rangesStore
    mutations.SET_SELECTED(state, rangesFixture[0])
    expect(state.selected).toEqual(rangesFixture[0])
  })

  it("[actions] should fetch and set a selected range", async () => {
    const { actions, state } = rangesStore

    const res = await actions.select({ commit, state })
    await flushPromises()

    expect(rangesService.select).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_SELECTED_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "SET_SELECTED", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_SELECTED_LOADING", false)
    expect(res).toEqual(rangesFixture[0])
  })

  it("[mutations] should add a range to the list", async () => {
    const { mutations, state } = rangesStore
    mutations.ADD_ONE(state, rangesFixture[0])
    expect(state.list).toEqual(expect.arrayContaining([ rangesFixture[0] ]))
    expect(state.count).toBe(1)
  })

  it("[actions] should create and add a range with action", async () => {
    const { actions, state } = rangesStore

    const res = await actions.create({ commit, state }, rangesFixture[0])
    await flushPromises()

    expect(rangesService.create).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_CREATE_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "ADD_ONE", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_CREATE_LOADING", false)
    expect(res).toEqual(rangesFixture[0])
  })

  it("[mutations] should remove range from the list", async () => {
    const { mutations, state } = rangesStore
    state.list = [ ...rangesFixture ]
    state.count = rangesFixture.length

    mutations.REMOVE_ONE(state, rangesFixture[0])

    rangesFixture.shift()
    expect(state.list).toEqual(rangesFixture)
    expect(state.count).toBe(rangesFixture.length)
  })

  it("[actions] should remove a range with action", async () => {
    const { actions, state } = rangesStore

    const res = await actions.removeOne({ commit, state }, rangesFixture[0])
    await flushPromises()

    expect(rangesService.removeOne).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_REMOVE_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "REMOVE_ONE", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_REMOVE_LOADING", false)
    expect(res).toEqual(true)
  })
})
