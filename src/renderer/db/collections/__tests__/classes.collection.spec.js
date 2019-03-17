import getDb from "@/db"
import { seedClasses } from "@/utils/tests/seeders"

const setup = async () => {
  await getDb()
  await seedClasses()
}

const cleanup = async () => {
  const db = await getDb()
  await db.remove()
}

describe("classes.collection", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should be able to find classes", async () => {
    const db = await getDb()
    const classes = await db.classes.find().exec()
    expect(classes.length).toBeGreaterThan(1)
  })
})
