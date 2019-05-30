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
    eventId: events[0].id,
    memberId: clubsMembers[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("clubs.members.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find club members", async () => {
    const db = await getDb()
    const members = await db.clubs_members.find().exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("should be able to populate a club member's club", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const club = await member.populate("clubId")
    expect(club.id).not.toBeFalsy()
  })

  it("should be able to find a club member's participants", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const participants = await db.events_participants.find({
      memberId: member.id
    }).exec()

    expect(participants.length).toBeGreaterThan(0)
  })

  it("removing a club member should also remove its participants", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()

    const participants1 = await db.events_participants.find({
      memberId: member.id
    }).exec()
    expect(participants1).not.toHaveLength(0)

    await member.remove()

    const participants2 = await db.events_participants.find({
      memberId: member.id
    }).exec()
    expect(participants2).toHaveLength(0)
  })
})
