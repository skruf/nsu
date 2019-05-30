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
  seedEventsDivisionsParticipants
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
  await seedEventsDivisionsParticipants({
    divisionId: divisions[0].id,
    participantId: participants[0].id,
    weaponId: weapons[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.divisions.participants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participants", async () => {
    const db = await getDb()
    const participants = await db.events_divisions_participants.find().exec()
    expect(participants.length).toBeGreaterThan(1)
  })

  it("should be able to find a divisions participants participant", async () => {
    const db = await getDb()
    const divisionParticipant = await db.events_divisions_participants.findOne().exec()
    const participant = await divisionParticipant.populate("participantId")
    expect(participant.id).not.toBeFalsy()
  })

  it("should be able to find a divisions participants division", async () => {
    const db = await getDb()
    const divisionParticipant = await db.events_divisions_participants.findOne().exec()
    const division = await divisionParticipant.populate("divisionId")
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to find a divisions participants weapon", async () => {
    const db = await getDb()
    const divisionParticipant = await db.events_divisions_participants.findOne().exec()
    const weapon = await divisionParticipant.populate("weaponId")
    expect(weapon.id).not.toBeFalsy()
  })
})
