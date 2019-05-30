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
  seedEventsDivisionsParticipants,
  seedEventsDivisionsParticipantsResults
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
  const divisionParticipants = await seedEventsDivisionsParticipants({
    divisionId: divisions[0].id,
    participantId: participants[0].id,
    weaponId: weapons[0].id
  })
  await seedEventsDivisionsParticipantsResults({
    divisionParticipantId: divisionParticipants[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.divisions.participants.results.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find results", async () => {
    const db = await getDb()
    const results = await db.events_divisions_participants_results.find().exec()
    expect(results.length).toBeGreaterThan(1)
  })

  it("should be able to find a divisions participants result", async () => {
    const db = await getDb()
    const result = await db.events_divisions_participants_results.findOne().exec()
    expect(result.id).not.toBeFalsy()
  })

  it("should be able to find a divisions participants participant", async () => {
    const db = await getDb()
    const result = await db.events_divisions_participants_results.findOne().exec()
    const divisionParticipant = await result.populate("divisionParticipantId")
    expect(divisionParticipant.id).not.toBeFalsy()
  })
})
