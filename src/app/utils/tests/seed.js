import { init } from "~/db"
import { getId, getTimestamp } from "~/utils"

const seed = async (collection, data) => {
  const timestamp = getTimestamp()
  data.id = getId()
  data.createdAt = timestamp
  data.updatedAt = timestamp
  const db = await init()
  const doc = await db[collection].insert(data)
  return doc
}

export const seedArray = async (collection, items) => {
  const data = await Promise.all(
    items.map(async (item) => {
      const doc = await seed(collection, item)
      return doc.toJSON()
    })
  )

  return data
}

export default seed
