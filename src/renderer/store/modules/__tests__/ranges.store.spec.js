import flushPromises from "flush-promises"
import rangesStore from "@/store/modules/ranges"
import { rangesFixture } from "@/fixtures"
import rangesService from "@/services/ranges.service.js"
jest.mock("@/services/ranges.service.js")

// @TODO: SET_LIST_FILTER

describe("ranges.store", () => {
  const commit = jest.fn()
  const initialState = { ...rangesStore.state }

  afterEach(() => {
    jest.clearAllMocks()
    rangesStore.state = { ...initialState }
  })

  it("should fetch and set a list of ranges", async () => {
    const { actions, state } = rangesStore

    const res = await actions.listAsync({ commit, state })
    await flushPromises()

    expect(rangesService.list).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_LIST_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "SET_LIST", rangesFixture)
    expect(commit).toHaveBeenNthCalledWith(3, "SET_COUNT", rangesFixture.length)
    expect(commit).toHaveBeenNthCalledWith(4, "SET_LIST_LOADING", false)
    expect(res.items).toEqual(rangesFixture)
    expect(res.count).toEqual(rangesFixture.length)
  })

  it("should set the list and count with ranges", async () => {
    const { mutations, state } = rangesStore

    mutations.SET_LIST(state, rangesFixture)
    mutations.SET_COUNT(state, rangesFixture.length)

    expect(state.list).toEqual(rangesFixture)
    expect(state.count).toBe(rangesFixture.length)
  })

  it("should fetch and set a selected range", async () => {
    const { actions, state } = rangesStore

    const res = await actions.selectAsync({ commit, state })
    await flushPromises()

    expect(rangesService.select).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_SELECTED_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "SET_SELECTED", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_SELECTED_LOADING", false)
    expect(res).toEqual(rangesFixture[0])
  })

  it("should set a selected range", async () => {
    const { mutations, state } = rangesStore

    mutations.SET_SELECTED(state, rangesFixture[0])

    expect(state.selected).toEqual(rangesFixture[0])
  })

  it("should create and add a range with action", async () => {
    const { actions, state } = rangesStore

    const res = await actions.createAsync({ commit, state }, rangesFixture[0])
    await flushPromises()

    expect(rangesService.create).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_CREATE_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "ADD_ONE", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_CREATE_LOADING", false)
    expect(res).toEqual(rangesFixture[0])
  })

  it("should add a range to the list", async () => {
    const { mutations, state } = rangesStore

    mutations.ADD_ONE(state, rangesFixture[0])

    expect(state.list).toEqual(expect.arrayContaining([ rangesFixture[0] ]))
    expect(state.count).toBe(1)
  })

  it("should remove a range with action", async () => {
    const { actions, state } = rangesStore

    const res = await actions.removeAsync({ commit, state }, rangesFixture[0])
    await flushPromises()

    expect(rangesService.remove).toHaveBeenCalled()
    expect(commit).toHaveBeenNthCalledWith(1, "SET_REMOVE_LOADING", true)
    expect(commit).toHaveBeenNthCalledWith(2, "REMOVE_ONE", rangesFixture[0])
    expect(commit).toHaveBeenNthCalledWith(3, "SET_REMOVE_LOADING", false)
    expect(res).toEqual(true)
  })

  it("should remove range from the list", async () => {
    const { mutations, state } = rangesStore
    state.list = [ ...rangesFixture ]
    state.count = rangesFixture.length

    mutations.REMOVE_ONE(state, rangesFixture[0])

    rangesFixture.shift()
    expect(state.list).toEqual(rangesFixture)
    expect(state.count).toBe(rangesFixture.length)
  })
})
