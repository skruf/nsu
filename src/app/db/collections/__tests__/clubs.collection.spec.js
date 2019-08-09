import { init } from "~/db"
import {
  seedClubs,
  seedClubsMembers,
  seedEvents
} from "~/utils/tests/seeders"

let db = null

const setup = async () => {
  db = await init()
  const clubs = await seedClubs()
  await seedClubsMembers({
    clubId: clubs[0].id
  })
  await seedEvents({
    organizerId: clubs[0].id
  })
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("clubs.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find clubs", async () => {
    const clubs = await db.clubs.find().exec()
    expect(clubs.length).toBeGreaterThan(1)
  })

  it("should be able to find a club's members", async () => {
    const club = await db.clubs.findOne().exec()
    const members = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("removing a club should also remove its club's members and update events", async () => {
    const club = await db.clubs.findOne().exec()

    const members1 = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members1).not.toHaveLength(0)
    const events1 = await db.events.find({ organizerId: club.id }).exec()
    expect(events1).not.toHaveLength(0)

    await club.remove()

    const members2 = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members2).toHaveLength(0)
    const events2 = await db.events.find({ organizerId: club.id }).exec()
    expect(events2).toHaveLength(0)
  })
})
