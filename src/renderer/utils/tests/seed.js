import getDb from "@/db"
import { setId, setTimestamps } from "@/utils"

const seed = async (collection, data) => {
  setId(data)
  setTimestamps(data)
  const db = await getDb()
  const doc = await db[collection].insert(data)
  return doc
}

export const seedArray = async (collection, items) => {
  const data = await Promise.all(
    items.map((item) => {
      return new Promise(async (resolve) => {
        const doc = await seed(collection, item)
        resolve(doc.toJSON())
      })
    })
  )

  return data
}

export default seed
