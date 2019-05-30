import getDb from "~/db"
import {
  seedClubs,
  seedClubsMembers,
  seedEvents
} from "~/utils/tests/seeders"

const setup = async () => {
  await getDb()
  const clubs = await seedClubs()
  await seedClubsMembers({
    clubId: clubs[0].id
  })
  await seedEvents({
    organizerId: clubs[0].id
  })
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("clubs.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find clubs", async () => {
    const db = await getDb()
    const clubs = await db.clubs.find().exec()
    expect(clubs.length).toBeGreaterThan(1)
  })

  it("should be able to find a club's members", async () => {
    const db = await getDb()
    const club = await db.clubs.findOne().exec()
    const members = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("removing a club should also remove its club's members and update events", async () => {
    const db = await getDb()
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
