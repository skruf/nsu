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
  seedEventsContestants,
  seedEventsContestantsResults
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
  const contestants = await seedEventsContestants({
    divisionId: divisions[0].id,
    participantId: participants[0].id,
    weaponId: weapons[0].id
  })
  seedEventsContestantsResults({
    contestantId: contestants[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.contestants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find contestants", async () => {
    const db = await getDb()
    const contestants = await db.events_contestants.find().exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it("should be able to populate a contestant's participant", async () => {
    const db = await getDb()
    const contestant = await db.events_contestants.findOne().exec()
    const participant = await contestant.populate("participantId")
    expect(participant.id).not.toBeFalsy()
  })

  it("should be able to populate a contestant's division", async () => {
    const db = await getDb()
    const contestant = await db.events_contestants.findOne().exec()
    const division = await contestant.populate("divisionId")
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to populate a contestant's weapon", async () => {
    const db = await getDb()
    const contestant = await db.events_contestants.findOne().exec()
    const weapon = await contestant.populate("weaponId")
    expect(weapon.id).not.toBeFalsy()
  })

  it("removing a contestant should also remove its results", async () => {
    const db = await getDb()
    const contestant = await db.events_contestants.findOne().exec()

    const results1 = await db.events_contestants_results.find({
      contestantId: contestant.id
    }).exec()
    expect(results1).not.toHaveLength(0)

    await contestant.remove()

    const results2 = await db.events_contestants_results.find({
      contestantId: contestant.id
    }).exec()
    expect(results2).toHaveLength(0)
  })
})
