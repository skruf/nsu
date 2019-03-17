import RxDB from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import configs from "./collections"
import router from "@/screens"
import log from "electron-log"

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

const configureCollection = async (config) => {
  const timestamp = { type: "string", format: "date-time" }
  config.collection.schema.properties.updatedAt = timestamp
  config.collection.schema.properties.createdAt = { ...timestamp, index: true }

  const collection = await db.collection(config.collection)

  for(let middleware in config.middlewares) {
    const { handle, parallel } = config.middlewares[middleware]
    collection[middleware](handle, parallel)
  }
}

export default async () => {
  if(db) return db

  try {
    db = await RxDB.create({
      name: "nsu",
      adapter: adapter,
      password: "nsu2020nsu2020nsu2020",
      multiInstance: false,
      queryChangeDetection: false
    })

    if(
      process.env.NODE_ENV !== "test" &&
      process.env.NODE_ENV !== "development"
    ) {
      db.$.subscribe((event) => { log.info(event) })
    }

    await Promise.all(configs.map(
      (config) => configureCollection(config))
    )
  } catch(e) {
    router.push({
      name: "ErrorScreen",
      params: { error: e.message }
    })
  }

  return db
}
