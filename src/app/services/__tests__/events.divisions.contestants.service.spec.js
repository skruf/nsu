import flushPromises from "flush-promises"
import { eventsDivisionsContestantsService } from "~/services"
import {
  eventsDivisionsContestantsFixture,
  eventsDivisionsFixture,
  clubsMembersFixture
  // classesFixture
} from "~/fixtures"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const {
    eventsDivisionsContestantsFixture,
    eventsDivisionsFixture,
    clubsMembersFixture
    // classesFixture
  } = require("~/fixtures")

  const mockQueries = require("~/utils/tests/mockQueries").default

  return mockQueries(eventsDivisionsContestantsFixture, {
    divisionId: { data: eventsDivisionsFixture[0] },
    memberId: { data: clubsMembersFixture[0] }
  }, true)
})

describe("events.divisions.contestants.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list event division contestant", async () => {
    const filter = {}
    const options = {}

    const res = await eventsDivisionsContestantsService.list(filter, options)
    const contestant = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsDivisionsContestantsFixture)
    expect(res.count).toEqual(eventsDivisionsContestantsFixture.length)
    expect(contestant).toEqual(eventsDivisionsContestantsFixture[0])
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.member).toEqual(clubsMembersFixture[0])
    // expect(contestant.class).toEqual(classesFixture[0])
  })

  it("should select a event division contestant", async () => {
    const filter = {}
    const options = {}

    const contestant = await eventsDivisionsContestantsService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(contestant).toEqual(eventsDivisionsContestantsFixture[0])
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.member).toEqual(clubsMembersFixture[0])
    // expect(contestant.weapon.class).toEqual(classesFixture[0])
  })

  it("should create a event division contestant", async () => {
    const data = {}
    const options = {}

    const contestant = await eventsDivisionsContestantsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(contestant).toEqual(eventsDivisionsContestantsFixture[0])
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.member).toEqual(clubsMembersFixture[0])
    // expect(contestant.class).toEqual(classesFixture[0])
  })

  it("should remove a event division contestant", async () => {
    const filter = {}
    const options = {}

    const res = await eventsDivisionsContestantsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many event division contestant", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsDivisionsContestantsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
