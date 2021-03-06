import flushPromises from "flush-promises"
import { rangesFixture } from "~/fixtures"
import { rangesService } from "~/services"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const { rangesFixture } = require("~/fixtures")
  const mockQueries = require("~/utils/tests/mockQueries").default
  return mockQueries(rangesFixture)
})

describe("ranges.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list ranges", async () => {
    const filter = {}
    const options = {}

    const res = await rangesService.list(filter, options)
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
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
    const item = {}
    const options = {}

    const res = await rangesService.removeOne(item, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many ranges", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await rangesService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
