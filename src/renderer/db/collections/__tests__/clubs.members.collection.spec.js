import getDb from "@/db"
import {
  seedClubs,
  seedClubsMembers
} from "@/utils/tests/seeders"

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

describe("clubs.members.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find clubs members", async () => {
    const db = await getDb()
    const members = await db.clubs_members.find().exec()
    expect(members.length).toBeGreaterThan(1)
  })

  it("should be able to find a clubs members", async () => {
    const db = await getDb()
    const member = await db.clubs_members.findOne().exec()
    const club = await member.populate("clubId")
    expect(club.id).not.toBeFalsy()
  })
})
