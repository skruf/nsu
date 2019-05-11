import flushPromises from "flush-promises"
import { eventsParticipantsService } from "~/services"
import {
  eventsParticipantsFixture,
  classesFixture,
  clubsFixture,
  clubsMembersFixture
} from "~/fixtures"
import {
  findMany, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const {
    eventsParticipantsFixture,
    classesFixture,
    clubsFixture,
    clubsMembersFixture
  } = require("~/fixtures")

  const mockQueries = require("~/utils/tests/mockQueries").default

  const populate = {
    classes: { data: classesFixture },
    memberId: {
      data: clubsMembersFixture[0],
      populate: {
        clubId: { data: clubsFixture[0] }
      }
    }
  }

  return mockQueries(eventsParticipantsFixture, populate)
})

describe("events.participants.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list event participants", async () => {
    const filter = {}
    const options = {}

    const res = await eventsParticipantsService.list(filter, options)
    const participant = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsParticipantsFixture)
    expect(res.count).toEqual(eventsParticipantsFixture.length)
    expect(participant).toEqual(eventsParticipantsFixture[0])
    expect(participant.member).toEqual(clubsMembersFixture[0])
    expect(participant.member.club).toEqual(clubsFixture[0])
    expect(participant.classes).toEqual(classesFixture)
  })

  it("should create a event participant", async () => {
    const data = {}
    const options = {}

    const participant = await eventsParticipantsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(participant).toEqual(eventsParticipantsFixture[0])
    expect(participant.member).toEqual(clubsMembersFixture[0])
    expect(participant.member.club).toEqual(clubsFixture[0])
    expect(participant.classes).toEqual(classesFixture)
  })

  it("should remove a event participant", async () => {
    const filter = {}
    const options = {}

    const res = await eventsParticipantsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many event participants", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsParticipantsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
