import getDb from "~/db"
import {
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsDivisions
} from "~/utils/tests/seeders"

const setup = async () => {
  await getDb()
  const ranges = await seedRanges()
  const clubs = await seedClubs()
  // const clubsMembers = await seedClubsMembers({
  //   clubId: clubs[0].id
  // })
  const events = await seedEvents({
    rangeId: ranges[0].id,
    organizerId: clubs[0].id
  })
  // await seedEventsParticipants({
  //   eventId: events[0].id,
  //   memberId: clubsMembers[0].id
  // })
  // await seedEventsDivisions({
  //   eventId: events[0].id
  // })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find events", async () => {
    const db = await getDb()
    const events = await db.events.find().exec()
    expect(events.length).toBeGreaterThan(1)
  })

  it("should be able to find an event", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    expect(event.id).not.toBeFalsy()
  })

  it("should be able to find a events range", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    const range = await event.populate("rangeId")
    expect(range.id).not.toBeFalsy()
  })

  it("should be able to find a events club", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    const club = await event.populate("organizerId")
    expect(club.id).not.toBeFalsy()
  })

  it.skip("should be able to find an event and its divisions", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    const divisions = await db.events_divisions.find({
      eventId: event.id
    }).exec()
    expect(divisions.length).toBeGreaterThan(1)
  })

  it.skip("should be able to find an event and its participants", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    const participants = await db.events_participants.find({
      eventId: event.id
    }).exec()
    expect(participants.length).toBeGreaterThan(1)
  })

  it.skip("removing events should remove its divisions", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    await event.remove()
    const divisions = await db.events_divisions.find({
      eventId: event.id
    }).exec()
    expect(divisions).toHaveLength(0)
  })

  it.skip("removing events should remove its participants", async () => {
    const db = await getDb()
    const event = await db.events.findOne().exec()
    await event.remove()
    const participants = await db.events_participants.find({
      eventId: event.id
    }).exec()
    expect(participants).toHaveLength(0)
  })
})
