import getDb from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsDivisions,
  seedEventsDivisionsContestants
} from "~/utils/tests/seeders"

const setup = async () => {
  await getDb()
  const classes = await seedClasses()
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
  const divisions = await seedEventsDivisions({
    eventId: events[0].id
  })
  await seedEventsDivisionsContestants({
    divisionId: divisions[0].id,
    memberId: clubsMembers[0].id,
    classId: classes[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("clubs.members.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find clubs members", async () => {
    const db = await getDb()
    const members = await db.clubs_members.find().exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("should be able to find a clubs members", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const club = await member.populate("clubId")
    expect(club.id).not.toBeFalsy()
  })

  it("should be able to find a club member contestants", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const divisions = await db.events_divisions.find().exec()
    const divisionIds = divisions.map((d) => d.toJSON().id)

    const contestants = await db.events_divisions_contestants.find({
      memberId: member.id,
      divisionId: { $in: divisionIds }
    }).exec()

    expect(contestants.length).toBeGreaterThan(0)
  })

  it("should be able to find a club member participant", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const participants = await db.events_participants.find({
      memberId: member.id
    }).exec()

    expect(participants.length).toBeGreaterThan(0)
  })

  it("removing club member should remove its participants", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    await member.remove()

    const participants = await db.events_participants.find({
      memberId: member.id
    }).exec()

    expect(participants).toHaveLength(0)
  })

  it("removing club member should remove its contestants", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    await member.remove()

    const divisions = await db.events_divisions.find().exec()
    const divisionIds = divisions.map((d) => d.toJSON().id)
    const contestants = await db.events_divisions_contestants.find({
      memberId: member.id,
      divisionId: { $in: divisionIds }
    }).exec()

    expect(contestants).toHaveLength(0)
  })
})
