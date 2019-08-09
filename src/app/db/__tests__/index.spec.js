import RxDB from "rxdb"
import { init } from "~/db"
import collections from "~/db/collections"

let db = null

const setup = async () => {
  db = await init()
}

const cleanup = async () => {
  await db.remove()
  db = null
}

describe("database", () => {
  beforeAll(() => setup())
  afterAll(() => cleanup())

  it("should init and get db", async () => {
    expect(RxDB.isRxDatabase(db)).toEqual(true)
    const hasMemoryAdapter = await RxDB.checkAdapter("memory")
    expect(hasMemoryAdapter).toEqual(true)
  })

  it("should be able to configure all collections", async () => {
    const invalid = collections.filter((config) => {
      const collection = db[config.collection.name]
      return !RxDB.isRxCollection(collection)
    })
    expect(invalid).toHaveLength(0)
  })
})
