import getDb from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsParticipantsWeapons
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
  await seedEventsParticipantsWeapons({
    classId: classes[0].id,
    participantId: participants[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("events.participants.weapons.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find participants weapons", async () => {
    const db = await getDb()
    const weapons = await db.events_participants_weapons.find().exec()
    expect(weapons.length).toBeGreaterThan(1)
  })

  it("should be able to find a weapons participant", async () => {
    const db = await getDb()
    const weapon = await db.events_participants_weapons.findOne().exec()
    const participant = await weapon.populate("participantId")
    expect(participant.id).not.toBeFalsy()
  })

  it("should be able to find a weapons class", async () => {
    const db = await getDb()
    const weapon = await db.events_participants_weapons.findOne().exec()
    const weaponClass = await weapon.populate("classId")
    expect(weaponClass.id).not.toBeFalsy()
  })

  it.skip("should be able to find a participants event", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    const event = await participant.populate("eventId")
    expect(event.id).not.toBeFalsy()
  })

  it.skip("removing a participant should remove its contestants", async () => {
    const db = await getDb()
    const participant = await db.events_participants.findOne().exec()
    await participant.remove()

    const divisions = await db.events_divisions.find({
      eventId: participant.eventId
    }).exec()
    const divisionIds = divisions.map((d) => d.toJSON().id)
    const contestants = await db.events_divisions_contestants.find({
      memberId: participant.memberId,
      divisionId: { $in: divisionIds }
    }).exec()

    expect(contestants).toHaveLength(0)
  })
})
