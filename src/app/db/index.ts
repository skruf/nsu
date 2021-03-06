import RxDB, { RxDatabase, RxCollectionCreator } from "rxdb"
import RxDBSchemaCheckModule from "rxdb/plugins/schema-check"
import RxDBErrorMessagesModule from "rxdb/plugins/error-messages"
import configs, { DatabaseCollections } from "./collections"
import router from "~/screens"
// import log from "electron-log"

type Database = RxDatabase<DatabaseCollections>

RxDB.plugin(RxDBErrorMessagesModule)
RxDB.plugin(RxDBSchemaCheckModule)

let adapter: string

if(process.env.NODE_ENV === "test") {
  adapter = "memory"
  RxDB.plugin(require("pouchdb-adapter-memory"))
} else {
  adapter = "idb"
  RxDB.plugin(require("pouchdb-adapter-idb"))
}

type CollectionConfig = {
  collection: RxCollectionCreator,
  middlewares?: {
    [key: string]: {
      handle: Function,
      parallel: boolean
    }
  }
}

const configureCollection = async (
  db: Database,
  config: CollectionConfig
): Promise<any> => {
  const timestamp = { type: "string", format: "date-time" }
  config.collection.schema.properties.updatedAt = timestamp
  config.collection.schema.properties.createdAt = {
    ...timestamp,
    index: true
  }

  const collection = await db.collection(config.collection)

  for(let middleware in config.middlewares) {
    const { handle, parallel } = config.middlewares[middleware]
    collection[middleware](handle, parallel)
  }
}

export let db: Database = null

export const init = async (): Promise<Database> => {
  if(db !== null) return db

  try {
    db = await RxDB.create<DatabaseCollections>({
      name: "nsu",
      adapter: adapter,
      password: "nsu2020nsu2020nsu2020",
      multiInstance: false,
      queryChangeDetection: false
    })

    await Promise.all(configs.map(
      (config) => configureCollection(db, config))
    )

    return db
  } catch(e) {
    console.error(e.message)
    router.push({
      name: "ErrorScreen",
      params: { error: e.message }
    })
  }
}

export default {
  get() {
    return db
  }
}
