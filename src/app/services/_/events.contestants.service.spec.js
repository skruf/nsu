import flushPromises from "flush-promises"
import { eventsContestantsService } from "~/services"
import {
  eventsContestantsFixture,
  eventsDivisionsFixture,
  eventsParticipantsFixture,
  clubsMembersFixture,
  eventsParticipantsWeaponsFixture,
  classesFixture
} from "~/fixtures"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const {
    eventsContestantsFixture,
    eventsDivisionsFixture,
    eventsParticipantsFixture,
    clubsMembersFixture,
    eventsParticipantsWeaponsFixture,
    classesFixture
  } = require("~/fixtures")

  const mockQueries = require("~/utils/tests/mockQueries").default

  return mockQueries(eventsContestantsFixture, {
    divisionId: {
      data: eventsDivisionsFixture[0]
    },
    participantId: {
      data: eventsParticipantsFixture[0],
      populate: {
        memberId: { data: clubsMembersFixture[0] }
      }
    },
    weaponId: {
      data: eventsParticipantsWeaponsFixture[0],
      populate: {
        classId: { data: classesFixture[0] }
      }
    }
  }, true)
})

describe("events.contestants.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list event contestant", async () => {
    const filter = {}
    const options = {}

    const res = await eventsContestantsService.list(filter, options)
    const contestant = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsContestantsFixture)
    expect(res.count).toEqual(eventsContestantsFixture.length)
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.participant).toEqual(eventsParticipantsFixture[0])
    expect(contestant.participant.member).toEqual(clubsMembersFixture[0])
    expect(contestant.weapon).toEqual(eventsParticipantsWeaponsFixture[0])
    expect(contestant.weapon.class).toEqual(classesFixture[0])
  })

  it("should select a event contestant", async () => {
    const filter = {}
    const options = {}

    const contestant = await eventsContestantsService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.participant).toEqual(eventsParticipantsFixture[0])
    expect(contestant.participant.member).toEqual(clubsMembersFixture[0])
    expect(contestant.weapon).toEqual(eventsParticipantsWeaponsFixture[0])
    expect(contestant.weapon.class).toEqual(classesFixture[0])
  })

  it("should create a event contestant", async () => {
    const data = {}
    const options = {}

    const contestant = await eventsContestantsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(contestant.division).toEqual(eventsDivisionsFixture[0])
    expect(contestant.participant).toEqual(eventsParticipantsFixture[0])
    expect(contestant.participant.member).toEqual(clubsMembersFixture[0])
    expect(contestant.weapon).toEqual(eventsParticipantsWeaponsFixture[0])
    expect(contestant.weapon.class).toEqual(classesFixture[0])
  })

  it("should remove a event contestant", async () => {
    const filter = {}
    const options = {}

    const res = await eventsContestantsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many event contestant", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsContestantsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
