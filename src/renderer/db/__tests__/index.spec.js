import RxDB from "rxdb"
import getDb from "@/db"

describe("database", () => {
  it("should init and get db", async () => {
    const db = await getDb()
    expect(RxDB.isRxDatabase(db)).toEqual(true)
    const hasMemoryAdapter = await RxDB.checkAdapter("memory")
    expect(hasMemoryAdapter).toEqual(true)
  })
})
