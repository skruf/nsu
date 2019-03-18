import getDb from "@/db"
import { seedRanges } from "@/utils/tests/seeders"

const setup = async () => {
  await getDb()
  await seedRanges()
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("ranges.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find ranges", async () => {
    const db = await getDb()
    const ranges = await db.ranges.find().exec()
    expect(ranges.length).toBeGreaterThan(1)
  })

  it("should be able to find a class", async () => {
    const db = await getDb()
    const range = await db.ranges.findOne().exec()
    expect(range.id).not.toBeFalsy()
  })
})
