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
    weaponId: weapons[0].id,
    eventId: events[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("events.participants.weapons.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participants weapons", async () => {
    const weapons = await db.events_participants_weapons.find().exec()
    expect(weapons.length).toBeGreaterThan(1)
  })

  it("should be able to populate a weapon's participant", async () => {
    const weapon = await db.events_participants_weapons.findOne().exec()
    const participant = await weapon.populate("participantId")
    expect(participant.id).not.toBeFalsy()
  })

  it("should be able to populate a weapon's class", async () => {
    const weapon = await db.events_participants_weapons.findOne().exec()
    const weaponClass = await weapon.populate("classId")
    expect(weaponClass.id).not.toBeFalsy()
  })

  it("removing a participant's weapon should also remove its contestants", async () => {
    const weapon = await db.events_participants_weapons.findOne().exec()

    const contestants1 = await db.events_contestants.find({
      weaponId: weapon.id
    }).exec()
    expect(contestants1).not.toHaveLength(0)

    await weapon.remove()

    const contestants2 = await db.events_contestants.find({
      weaponId: weapon.id
    }).exec()
    expect(contestants2).toHaveLength(0)
  })
})
