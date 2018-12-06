import Collection from "nedb"
import path from "path"
import { remote } from "electron"

const createOrGetCollection = (name) => {
  const collection = new Collection({
    autoload: true,
    filename: path.join(remote.app.getPath("userData"), `/${name}.db`)
  })

  return collection
}

const db = {
  events: createOrGetCollection("events"),
  clubs: createOrGetCollection("clubs")
}

const setTimestamps = (doc) => {
  const date = new Date()
  doc.createdAt = date
  doc.updatedAt = date
  return doc
}

const query = (collection, method, filter, options) => {
  if(options.search && options.search.value) {
    const $or = []

    options.search.fields.forEach((field) => {
      $or.push({ [field]: { $regex: new RegExp(`${options.search.value}`, "i") } })
    })

    filter = {
      $and: [ filter, { $or } ]
    }
  }

  // console.log("query")

  const operation = db[collection][method](filter)

  if(options.sort) {
    let order = 1
    if(options.sort.charAt(0) === "-") {
      order = -1
      options.sort = options.sort.substr(1)
    }
    operation.sort({ [options.sort]: order })
  }

  if(options.skip) {
    operation.skip(options.skip)
  }

  if(options.limit) {
    operation.limit(options.limit)
  }

  return new Promise((resolve, reject) => {
    operation.exec((err, result) => {
      if(err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

export const find = (collection, filter = {}, options = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const results = await query(collection, "find", filter, options)
      // const count = await query(collection, "count", filter, options)
      resolve({ [collection]: results, count: 5 })
    } catch(e) {
      reject(e)
    }
  })
}

export const findOne = (collection, filter = {}, options = {}) => {
  return query(collection, "findOne", filter, options)
}

export const insert = (collection, doc) => {
  setTimestamps(doc)
  return new Promise((resolve, reject) => {
    db[collection].insert(doc, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
  })
}

export const remove = (collection, filter = {}) => {
  return new Promise((resolve, reject) => {
    db[collection].remove(filter, (err, result) => {
      if(err) return reject(err)
      resolve(result)
    })
  })
}
