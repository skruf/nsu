import { setId, setTimestamps } from "@/utils"
import getDb from "@/db"

const buildQuery = async (collection, method, filter = {}, options = {}) => {
  const db = await getDb()

  if(options.search && options.search.value) {
    const $or = []

    options.search.fields.forEach((field) => {
      $or.push({
        [field]: {
          $regex: new RegExp(`${options.search.value}`, "i")
        }
      })
    })

    filter = {
      $and: [ filter, { $or } ]
    }
  }

  // console.log(filter)
  // console.log(collection)
  // console.log("--------")

  let operation = db[collection][method](filter)

  if(options.sort) {
    // @TODO: bugfix sorting while searching
    if(options.search && options.search.value) {
    } else {
      operation = operation.sort(options.sort)
    }
  }

  if(options.skip) {
    operation = operation.skip(options.skip)
  }

  if(options.limit) {
    operation = operation.limit(options.limit)
  }

  return operation
}

export const findMany = async (
  collection, filter = {}, options = {}, json = false
) => {
  const query = await buildQuery(collection, "find", filter, options)
  let docs = await query.exec()
  if(json) docs = docs.map((doc) => doc.toJSON())
  return { items: docs, count: docs.length }
}

export const findOne = async (
  collection, filter, options = {}, json = false
) => {
  const db = await getDb()
  let doc = await db[collection].findOne(filter).exec()
  if(json) doc = doc.toJSON()
  return doc
}

export const insert = async (collection, data, options = {}, json = false) => {
  const db = await getDb()
  setId(data)
  setTimestamps(data)
  let doc = db[collection].insert(data)
  if(json) doc = doc.toJSON()
  return doc
}

export const insertMany = async (
  collection, items, options = {}, json = false
) => {
  const docs = await Promise.all(
    items.map((item) => insert(collection, item, options, json))
  )
  return docs
}

export const destroyOne = async (collection, filter = {}, options = {}) => {
  const doc = await findOne(collection, filter, options)
  await doc.remove()
}

export const destroyMany = async (collection, filter = {}, options = {}) => {
  const docs = await findMany(collection, filter, options)
  await Promise.all(
    docs.items.map((doc) => doc.remove())
  )
}

export const updateOne = async (
  collection, filter, item, options = {}, json = false
) => {
  let doc = await findOne(collection, filter, options)
  const date = new Date()
  item.updatedAt = date.toISOString()
  await doc.update({ $set: item })
  if(json) doc = doc.toJSON()
  return doc
}
