import getDb from "~/db"
import {
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants
} from "~/utils/tests/seeders"

const setup = async () => {
  await getDb()
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
    memberId: clubsMembers[0].id,
    eventId: events[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.participants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participants", async () => {
    const db = await getDb()
    const participants = await db.events_participants.find().exec()
    expect(participants.length).toBeGreaterThan(1)
  })

  it("should be able to find a participants member", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    const member = await participant.populate("memberId")
    expect(member.id).not.toBeFalsy()
  })

  it("should be able to find a participants event", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    const event = await participant.populate("eventId")
    expect(event.id).not.toBeFalsy()
  })

  it.skip("removing a participant should remove its contestants", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    await participant.remove()

    const divisions = await db.events_divisions.find({
      eventId: participant.eventId
    }).exec()
    const divisionIds = divisions.map((d) => d.toJSON().id)
    const contestants = await db.events_divisions_contestants.find({
      memberId: participant.memberId,
      divisionId: { $in: divisionIds }
    }).exec()

    expect(contestants).toHaveLength(0)
  })
})
