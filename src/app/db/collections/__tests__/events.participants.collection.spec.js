import getDb from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsParticipantsWeapons,
  seedEventsDivisions,
  seedEventsContestants
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
  const participants = await seedEventsParticipants({
    memberId: clubsMembers[0].id,
    eventId: events[0].id
  })
  const weapons = await seedEventsParticipantsWeapons({
    classId: classes[0].id,
    participantId: participants[0].id
  })
  const divisions = await seedEventsDivisions({
    eventId: events[0].id
  })
  await seedEventsContestants({
    divisionId: divisions[0].id,
    participantId: participants[0].id,
    weaponId: weapons[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.participants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participant's", async () => {
    const db = await getDb()
    const participants = await db.events_participants.find().exec()
    expect(participants.length).toBeGreaterThan(1)
  })

  it("should be able to populate a participant's member", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    const member = await participant.populate("memberId")
    expect(member.id).not.toBeFalsy()
  })

  it("should be able to populate a participant's event", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    const event = await participant.populate("eventId")
    expect(event.id).not.toBeFalsy()
  })

  it("removing a participant should also remove its contestants", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      participantId: participant.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await participant.remove()

    const contestants2 = await db.events_contestants.find({
      participantId: participant.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })

  it("removing a participant should also remove its weapons", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()

    const weapons1 = await db.events_participants_weapons.find({
      participantId: participant.id
    }).exec()
    expect(weapons1).toHaveLength(0)

    await participant.remove()

    const weapons2 = await db.events_participants_weapons.find({
      participantId: participant.id
    }).exec()
    expect(weapons2).toHaveLength(0)
  })
})
