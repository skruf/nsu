import RxDB from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import PouchdbAdapterIdb from "pouchdb-adapter-idb"
import collections from "./collections"

RxDB.plugin(RxDBErrorMessagesModule)
RxDB.plugin(RxDBSchemaCheckModule)
RxDB.plugin(PouchdbAdapterIdb)
// RxDB.removeDatabase("nsu", "idb")

let db = null

export default async () => {
  if(db) return db

  db = await RxDB.create({
    name: "nsu",
    adapter: "idb",
    password: "nsu2020nsu2020nsu2020",
    multiInstance: false,
    queryChangeDetection: false
  })

  await Promise.all(collections.map(
    (collection) => db.collection(collection))
  )

  return db
}
