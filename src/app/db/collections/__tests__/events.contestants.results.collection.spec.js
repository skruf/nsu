import { init } from "~/db"
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

let db = null

const setup = async () => {
  db = await init()
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
    weaponId: weapons[0].id,
    eventId: events[0].id
  })
  await seedEventsContestantsResults({
    contestantId: contestants[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("events.contestants.results.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find results", async () => {
    const results = await db.events_contestants_results.find().exec()
    expect(results.length).toBeGreaterThan(1)
  })

  it("should be able to find a result", async () => {
    const result = await db.events_contestants_results.findOne().exec()
    expect(result.id).not.toBeFalsy()
  })

  it("should be able to populate a result's contestant", async () => {
    const result = await db.events_contestants_results.findOne().exec()
    const contestant = await result.populate("contestantId")
    expect(contestant.id).not.toBeFalsy()
  })
})
