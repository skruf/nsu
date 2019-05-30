import getDb from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
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
  const divisions = await seedEventsDivisions({
    eventId: events[0].id
  })

  // await seedEventsParticipantsWeapons({
  //   classId: classes[0].id,
  //   participantId: participants[0].id
  // })
  // await seedEventsDivisionsParticipants({
  //   divisionId: divisions[0].id,
  //   memberId: clubsMembers[0].id,
  //   weapon: {
  //     classId: classes[0].id
  //   }
  // })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.divisions.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find divisions", async () => {
    const db = await getDb()
    const divisions = await db.events_divisions.find().exec()
    expect(divisions.length).toBeGreaterThan(1)
  })

  it("should be able to find a division", async () => {
    const db = await getDb()
    const division = await db.events_divisions.findOne().exec()
    expect(division.id).not.toBeFalsy()
  })

  it.skip("should be able to find a division contestants", async () => {
    const db = await getDb()
    const division = await db.events_divisions.findOne().exec()
    const contestants = await db.events_divisions_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it.skip("removing divisions should remove its contestants", async () => {
    const db = await getDb()
    const division = await db.events_divisions.findOne().exec()
    await division.remove()
    const contestants = await db.events_divisions_contestants.find({
      divisionId: division.id
    }).exec()
    expect(contestants).toHaveLength(0)
  })
})
