import flushPromises from "flush-promises"
import { eventsService } from "~/services"
import { eventsFixture, rangesFixture, clubsFixture } from "~/fixtures"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const { eventsFixture, rangesFixture, clubsFixture } = require("~/fixtures")
  const mockQueries = require("~/utils/tests/mockQueries").default
  return mockQueries(eventsFixture, {
    rangeId: { data: rangesFixture[0] },
    organizerId: { data: clubsFixture[0] }
  })
})

describe("events.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list events", async () => {
    const filter = {}
    const options = {}

    const res = await eventsService.list(filter, options)
    const event = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsFixture)
    expect(res.count).toEqual(eventsFixture.length)
    expect(event).toEqual(eventsFixture[0])
    expect(event.range).toEqual(rangesFixture[0])
    expect(event.club).toEqual(clubsFixture[0])
  })

  it("should select a event", async () => {
    const filter = {}
    const options = {}

    const event = await eventsService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(event).toEqual(eventsFixture[0])
    expect(event.range).toEqual(rangesFixture[0])
    expect(event.club).toEqual(clubsFixture[0])
  })

  it("should create a event", async () => {
    const data = {}
    const options = {}

    const event = await eventsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(event).toEqual(eventsFixture[0])
    expect(event.range).toEqual(rangesFixture[0])
    expect(event.club).toEqual(clubsFixture[0])
  })

  it("should remove a event", async () => {
    const filter = {}
    const options = {}

    const res = await eventsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many events", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
