import { setId, setTimestamps } from "@/utils"
import getDb from "@/db"

const buildQuery = async (collection, method, filter = {}, options = {}) => {
  const db = await getDb()

  if(options.search && options.search.value) {
    const $or = []

    options.search.fields.forEach((field) => {
      $or.push({ [field]: { $regex: new RegExp(`${options.search.value}`, "i") } })
    })

    filter = {
      $and: [ filter, { $or } ]
    }
  }

  let operation = db[collection][method](filter)

  if(options.sort) {
    operation = operation.sort(options.sort)
  }

  if(options.skip) {
    operation = operation.skip(options.skip)
  }

  if(options.limit) {
    operation = operation.limit(options.limit)
  }

  return operation
}

export const find = async (collection, filter = {}, options = {}) => {
  const query = await buildQuery(collection, "find", filter, options)
  const items = await query.exec()
  return { items, count: items.length }
}

export const findOne = async (collection, filter, options = {}) => {
  const db = await getDb()
  const doc = await db[collection].findOne(filter).exec()
  return doc
}

export const insert = async (collection, doc) => {
  const db = await getDb()
  setId(doc)
  setTimestamps(doc)
  const newDoc = db[collection].insert(doc)
  return newDoc
}

export const destroy = async (collection, filter = {}, options = {}) => {
  const doc = await findOne(collection, filter, options)
  await doc.remove()
}
