import flushPromises from "flush-promises"
import rangesStore from "@/store/modules/ranges"
import { rangesFixture } from "@/fixtures"
import rangesService from "@/services/ranges.service.js"
jest.mock("@/services/ranges.service.js")

describe("ranges.store", () => {
  const commit = jest.fn()

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
})
