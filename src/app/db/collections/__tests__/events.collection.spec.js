import { init } from "~/db"
import {
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsDivisions
} from "~/utils/tests/seeders"

let db = null

const setup = async () => {
  db = await init()
  const ranges = await seedRanges()
  const clubs = await seedClubs()
  const clubsMembers = await seedClubsMembers({
    clubId: clubs[0].id
  })
  const events = await seedEvents({
    rangeId: ranges[0].id,
    organizerId: clubs[0].id
  })
  await seedEventsParticipants({
    eventId: events[0].id,
    memberId: clubsMembers[0].id
  })
  await seedEventsDivisions({
    eventId: events[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("events.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find events", async () => {
    const events = await db.events.find().exec()
    expect(events.length).toBeGreaterThan(1)
  })

  it("should be able to find an event", async () => {
    const event = await db.events.findOne().exec()
    expect(event.id).not.toBeFalsy()
  })

  it("should be able to populate an event's range", async () => {
    const event = await db.events.findOne().exec()
    const range = await event.populate("rangeId")
    expect(range.id).not.toBeFalsy()
  })

  it("should be able to populate an event's club", async () => {
    const event = await db.events.findOne().exec()
    const club = await event.populate("organizerId")
    expect(club.id).not.toBeFalsy()
  })

  it("removing an event should also remove its divisions", async () => {
    const event = await db.events.findOne().exec()

    const divisions1 = await db.events_divisions.find({
      eventId: event.id
    }).exec()
    expect(divisions1).not.toHaveLength(0)

    await event.remove()

    const divisions2 = await db.events_divisions.find({
      eventId: event.id
    }).exec()
    expect(divisions2).toHaveLength(0)
  })

  it("removing an event should also remove its participants", async () => {
    const event = await db.events.findOne().exec()

    const participants1 = await db.events_participants.find({
      eventId: event.id
    }).exec()
    expect(participants1).toHaveLength(0)

    await event.remove()

    const participants2 = await db.events_participants.find({
      eventId: event.id
    }).exec()
    expect(participants2).toHaveLength(0)
  })
})
