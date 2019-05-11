import getDb from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
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

describe("events.divisions.contestants.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find contestants", async () => {
    const db = await getDb()
    const contestants = await db.events_divisions_contestants.find().exec()
    expect(contestants.length).toBeGreaterThan(1)
  })

  it("should be able to find a contestants member", async () => {
    const db = await getDb()
    const contestant = await db.events_divisions_contestants.findOne().exec()
    const member = await contestant.populate("memberId")
    expect(member.id).not.toBeFalsy()
  })

  it("should be able to find a contestants division", async () => {
    const db = await getDb()
    const contestant = await db.events_divisions_contestants.findOne().exec()
    const division = await contestant.populate("divisionId")
    expect(division.id).not.toBeFalsy()
  })

  it("should be able to find a contestants class", async () => {
    const db = await getDb()
    const contestant = await db.events_divisions_contestants.findOne().exec()
    const weaponClass = await contestant.populate("classId")
    expect(weaponClass.id).not.toBeFalsy()
  })
})
