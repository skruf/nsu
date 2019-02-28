import flushPromises from "flush-promises"
import { rangesFixture } from "@/fixtures"
import rangesService from "@/services/ranges.service"

import { find, findOne, insert, destroy } from "@/db/queries"
jest.mock("@/db/queries")

describe("ranges.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list ranges", async () => {
    const filter = {}
    const options = {}

    const res = await rangesService.list(filter, options)
    await flushPromises()

    expect(find).toHaveBeenCalled()
    expect(res.items).toEqual(rangesFixture)
    expect(res.count).toEqual(rangesFixture.length)
  })

  it("should select a range", async () => {
    const filter = {}
    const options = {}

    const res = await rangesService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(res).toEqual(rangesFixture[0])
  })

  it("should create a range", async () => {
    const filter = {}
    const options = {}

    const res = await rangesService.create(filter, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(res).toEqual(rangesFixture[0])
  })

  it("should remove a range", async () => {
    const filter = {}
    const options = {}

    const res = await rangesService.remove(filter, options)
    await flushPromises()

    expect(destroy).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
