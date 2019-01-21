import { setId, setTimestamps } from "@/utils"
import getDb from "@/db"

// options = {}
const buildQuery = async (collection, method, filter = {}) => {
  const db = await getDb()

  // if(options.search && options.search.value) {
  //   const $or = []
  //
  //   options.search.fields.forEach((field) => {
  //     $or.push({ [field]: { $regex: new RegExp(`${options.search.value}`, "i") } })
  //   })
  //
  //   filter = {
  //     $and: [ filter, { $or } ]
  //   }
  // }

  const operation = db[collection][method](filter)

  return operation

  // if(options.sort) {
  //   let order = 1
  //   if(options.sort.charAt(0) === "-") {
  //     order = -1
  //     options.sort = options.sort.substr(1)
  //   }
  //   operation.sort({ [options.sort]: order })
  // }

  // if(options.skip) {
  //   operation.skip(options.skip)
  // }

  // if(options.limit) {
  //   operation.limit(options.limit)
  // }

  // return new Promise((resolve, reject) => {
  //   operation.exec((err, result) => {
  //     if(err) {
  //       return reject(err)
  //     }
  //     resolve(result)
  //   })
  // })
}

export const find = async (collection, filter = {}, options = {}) => {
  const query = await buildQuery(collection, "find", filter, options)
  const items = await query.exec()
  const count = 1 // collection.countDocuments(filter)
  return { items, count }

  // return new Promise(async (resolve, reject) => {
  //   try {
  //     const results = await query(collection, "find", filter, options)
  //     const count = await query(collection, "count")
  //     resolve({ items: results, count })
  //   } catch(e) {
  //     reject(e)
  //   }
  // })
}

export const findOne = () => {}

// export const findOne = (collection, filter = {}, options = {}) => {
//  return query(collection, "findOne", filter, options)
// }

export const insert = async (collection, doc) => {
  const db = await getDb()
  setId(doc)
  setTimestamps(doc)
  return new Promise((resolve, reject) => {
    db[collection].insert(doc, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
  })
}

export const destroy = async (collection, filter = {}) => {
  const db = await getDb()
  return new Promise((resolve, reject) => {
    db[collection].remove(filter, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
  })
}
