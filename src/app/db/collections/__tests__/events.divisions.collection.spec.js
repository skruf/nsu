import { init } from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsDivisions,
  seedEventsParticipants,
  seedEventsParticipantsWeapons,
  seedEventsContestants
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
  const divisions = await seedEventsDivisions({
    eventId: events[0].id
  })
  const participants = await seedEventsParticipants({
    memberId: clubsMembers[0].id,
    eventId: events[0].id
  })
  const weapons = await seedEventsParticipantsWeapons({
    classId: classes[0].id,
    participantId: participants[0].id
  })
  await seedEventsContestants({
    divisionId: divisions[0].id,
    participantId: participants[0].id,
    weaponId: weapons[0].id,
    eventId: events[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("events.divisions.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find divisions", async () => {
    const divisions = await db.events_divisions.find().exec()
    expect(divisions.length).toBeGreaterThan(1)
  })

  it("should be able to find a division", async () => {
    const division = await db.events_divisions.findOne().exec()
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to find a division's contestants", async () => {
    const division = await db.events_divisions.findOne().exec()
    const contestants = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it("removing a division should also remove its contestants", async () => {
    const division = await db.events_divisions.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await division.remove()

    const contestants2 = await db.events_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })
})
