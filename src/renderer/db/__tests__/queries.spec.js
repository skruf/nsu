import getDb from "@/db"
import { dbFixture, clubsFixture } from "@/fixtures"
import { insert, find, findOne, destroy } from "@/db/queries"

const seed = async () => {
  const db = await getDb()
  await db.importDump(dbFixture)
}

const cleanup = async () => {
  const db = await getDb()
  // await db.destroy()
  await db.remove()
}

describe("database queries", () => {
  beforeAll(() => seed())
  afterAll(() => cleanup())

  it("should list and count", async () => {
    const filter = {}
    const options = {}
    const results = await find("clubs", filter, options)
    expect(results.items[0].id).toEqual(clubsFixture[0].id)
    expect(results.count).toEqual(clubsFixture.length)
  })

  it("should filter", async () => {
    const mock = clubsFixture[2]
    const filter = { id: mock.id }
    const options = {}
    const results = await find("clubs", filter, options)
    expect(results.items[0].id).toEqual(mock.id)
    expect(results.count).toEqual(1)
  })

  it("should search", async () => {
    const mock = clubsFixture[0]
    const filter = {}
    const options = {
      search: { fields: [ "name" ], value: mock.name }
    }
    const results = await find("clubs", filter, options)
    expect(results.items[0].name).toEqual(mock.name)
    expect(results.count).toEqual(1)
  })

  it("should sort", async () => {
    const filter = {}
    const options = { sort: "-id" }
    const results = await find("clubs", filter, options)
    expect(results.items[0].id).toEqual(clubsFixture[clubsFixture.length - 2].id)
    expect(results.count).toEqual(clubsFixture.length)
  })

  it("should paginate", async () => {
    const filter = {}
    const options = { skip: 3, limit: 6 }
    const results = await find("clubs", filter, options)
    results.items.forEach((i) => i.toJSON().id)
    expect(results.count).toEqual(3)
  })
})
