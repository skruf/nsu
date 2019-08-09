import flushPromises from "flush-promises"
import { eventsParticipantsWeaponsService } from "~/services"
import {
  classesFixture,
  eventsParticipantsFixture,
  eventsParticipantsWeaponsFixture
} from "~/fixtures"
import {
  findMany, insertMany, destroyOne, destroyMany, updateMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const {
    classesFixture,
    eventsParticipantsFixture,
    eventsParticipantsWeaponsFixture
  } = require("~/fixtures")

  const mockQueries = require("~/utils/tests/mockQueries").default

  const populate = {
    classId: { data: classesFixture[0] },
    participantId: { data: eventsParticipantsFixture[0] }
  }

  return mockQueries(eventsParticipantsWeaponsFixture, populate, true)
})

describe("events.participants.weapons.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list event participants weapons", async () => {
    const filter = {}
    const options = {}

    const res = await eventsParticipantsWeaponsService.list(filter, options)
    const weapon = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(eventsParticipantsWeaponsFixture)
    expect(res.count).toEqual(eventsParticipantsWeaponsFixture.length)

    expect(weapon).toEqual(eventsParticipantsWeaponsFixture[0])
    expect(weapon.class).toEqual(classesFixture[0])
    expect(weapon.participant).toEqual(eventsParticipantsFixture[0])
  })

  it("should create many event participants", async () => {
    const data = [{}]

    const weapons = await eventsParticipantsWeaponsService.createMany(data)
    await flushPromises()

    expect(insertMany).toHaveBeenCalled()
    expect(weapons).toEqual(eventsParticipantsWeaponsFixture)
    expect(weapons[0].class).toEqual(classesFixture[0])
    expect(weapons[0].participant).toEqual(eventsParticipantsFixture[0])
  })

  it("should remove a event participant weapon", async () => {
    const filter = {}
    const options = {}

    const res = await eventsParticipantsWeaponsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many event participants weapons", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await eventsParticipantsWeaponsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should update many event participants weapons", async () => {
    const data = [{}]

    const weapons = await eventsParticipantsWeaponsService.editMany(data)
    await flushPromises()

    expect(updateMany).toHaveBeenCalled()
    expect(weapons).toEqual(eventsParticipantsWeaponsFixture)
    expect(weapons[0].class).toEqual(classesFixture[0])
    expect(weapons[0].participant).toEqual(eventsParticipantsFixture[0])
  })
})
