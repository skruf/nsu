import flushPromises from "flush-promises"
import { eventsDivisionsService } from "~/services"
import { eventsDivisionsFixture } from "~/fixtures"
import {
  findMany, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const { eventsDivisionsFixture } = require("~/fixtures")
  const mockQueries = require("~/utils/tests/mockQueries").default
  return mockQueries(eventsDivisionsFixture)
})

describe("events.divisions.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list event divisions", async () => {
    const filter = {}
    const options = {}

    const res = await eventsDivisionsService.list(filter, options)
    const division = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsDivisionsFixture)
    expect(res.count).toEqual(eventsDivisionsFixture.length)
    expect(division).toEqual(eventsDivisionsFixture[0])
  })

  it("should create a event division", async () => {
    const data = {}
    const options = {}

    const division = await eventsDivisionsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(division).toEqual(eventsDivisionsFixture[0])
  })

  it("should remove a event division", async () => {
    const filter = {}
    const options = {}

    const res = await eventsDivisionsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many event divisions", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsDivisionsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
