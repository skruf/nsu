import { init } from "~/db"
import {
  seedClasses,
  seedRanges,
  seedClubs,
  seedClubsMembers,
  seedEvents,
  seedEventsParticipants,
  seedEventsParticipantsWeapons
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
  await seedEventsParticipantsWeapons({
    classId: classes[0].id,
    participantId: participants[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("classes.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find classes", async () => {
    const classes = await db.classes.find().exec()
    expect(classes.length).toBeGreaterThan(1)
  })

  it("should be able to find a class", async () => {
    const weaponClass = await db.classes.findOne().exec()
    expect(weaponClass.id).not.toBeFalsy()
  })

  it("removing a class should also remove participants weapon's", async () => {
    const weaponClass = await db.classes.findOne().exec()

    const weapons1 = await db.events_participants_weapons.find({
      classId: weaponClass.id
    }).exec()
    expect(weapons1).not.toHaveLength(0)

    await weaponClass.remove()

    const weapons2 = await db.events_participants_weapons.find({
      classId: weaponClass.id
    }).exec()
    expect(weapons2).toHaveLength(0)
  })
})
