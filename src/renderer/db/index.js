import RxDB from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import collections from "./collections"

RxDB.plugin(RxDBErrorMessagesModule)
RxDB.plugin(RxDBSchemaCheckModule)

let db = null
let adapter = null

if(process.env.NODE_ENV === "test") {
  adapter = "memory"
  RxDB.plugin(require("pouchdb-adapter-memory"))
} else {
  adapter = "idb"
  RxDB.plugin(require("pouchdb-adapter-idb"))
}

export default async () => {
  if(db) return db

  db = await RxDB.create({
    name: "nsu",
    adapter: adapter,
    password: "nsu2020nsu2020nsu2020",
    multiInstance: false,
    queryChangeDetection: false
  })

  // db.$.subscribe((event) => { console.log(event) })

  await Promise.all(collections.map(
    (collection) => {
      collection.schema.properties.updatedAt = {
        type: "string",
        format: "date-time"
      }
      collection.schema.properties.createdAt = {
        type: "string",
        format: "date-time",
        index: true
      }
      return db.collection(collection)
    })
  )

  return db
}
