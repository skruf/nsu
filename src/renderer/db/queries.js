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

export const findMany = async (collection, filter = {}, options = {}) => {
  const query = await buildQuery(collection, "find", filter, options)
  const items = await query.exec()
  return { items, count: items.length }
}

export const findOne = async (collection, filter, options = {}) => {
  const db = await getDb()
  const doc = await db[collection].findOne(filter).exec()
  return doc
}

export const insert = async (collection, doc, options = {}) => {
  const db = await getDb()
  setId(doc)
  setTimestamps(doc)
  const newDoc = db[collection].insert(doc)
  return newDoc
}

export const insertMany = async (collection, items, options = {}) => {
  const docs = await Promise.all(
    items.map((item) => insert(collection, item, options))
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
