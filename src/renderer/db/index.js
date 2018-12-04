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

export const insert = (collection, doc) => {
  const date = new Date()
  doc.createdAt = date
  doc.updatedAt = date

  return new Promise((resolve, reject) => {
    db[collection].insert(doc, (err, result) => {
      if(err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}

export const find = (collection, query = {}) => {
  return new Promise((resolve, reject) => {
    db[collection].find(query, (err, result) => {
      if(err) {
        return reject(err)
      }
      resolve(result)
    })
  })
}
