import flushPromises from "flush-promises"
import { eventsContestantsResultsService } from "~/services"
import {
  eventsContestantsResultsFixture,
  eventsContestantsFixture
} from "~/fixtures"
import {
  findMany, insertMany, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const {
    eventsContestantsResultsFixture,
    eventsContestantsFixture
  } = require("~/fixtures")

  const mockQueries = require("~/utils/tests/mockQueries").default

  return mockQueries(eventsContestantsResultsFixture, {
    contestantId: {
      data: eventsContestantsFixture[0]
    }
  }, true)
})

describe("events.contestants.results.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list results with contestants", async () => {
    const filter = {}
    const options = {}

    const res = await eventsContestantsResultsService.list(filter, options)
    const result = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsContestantsResultsFixture)
    expect(res.count).toEqual(eventsContestantsResultsFixture.length)
    expect(result).toEqual(eventsContestantsResultsFixture[0])
    expect(result.contestant).toEqual(eventsContestantsFixture[0])
  })

  it("should create many results", async () => {
    const data = {}
    const options = {}

    const results = await eventsContestantsResultsService.createMany(data, options)
    await flushPromises()

    expect(insertMany).toHaveBeenCalled()
    expect(results.items[0]).toEqual(eventsContestantsResultsFixture[0])
    expect(results.items[0].contestant).toEqual(eventsContestantsFixture[0])
  })

  it("should remove a result", async () => {
    const filter = {}
    const options = {}

    const res = await eventsContestantsResultsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many results", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsContestantsResultsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
