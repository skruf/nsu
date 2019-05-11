import getDb from "~/db"
import {
  seedClubs,
  seedClubsMembers
} from "~/utils/tests/seeders"

const setup = async () => {
  await getDb()
  const clubs = await seedClubs()
  await seedClubsMembers({
    clubId: clubs[0].id
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

  it("should be able to find a clubs members", async () => {
    const db = await getDb()
    const club = await db.clubs.findOne().exec()
    const members = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("removing clubs should remove its clubs members", async () => {
    const db = await getDb()
    const club = await db.clubs.findOne().exec()
    await club.remove()
    const members = await db.clubs_members.find({ clubId: club.id }).exec()
    expect(members).toHaveLength(0)
  })
})
