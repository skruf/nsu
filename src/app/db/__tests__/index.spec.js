import RxDB from "rxdb"
import getDb from "~/db"
import collections from "~/db/collections"

describe("database", () => {
  it("should init and get db", async () => {
    const db = await getDb()
    expect(RxDB.isRxDatabase(db)).toEqual(true)
    const hasMemoryAdapter = await RxDB.checkAdapter("memory")
    expect(hasMemoryAdapter).toEqual(true)
  })

  it("should be able to configure all collections", async () => {
    const db = await getDb()
    const invalid = collections.filter((config) => {
      const collection = db[config.collection.name]
      return !RxDB.isRxCollection(collection)
    })
    expect(invalid).toHaveLength(0)
  })
})
