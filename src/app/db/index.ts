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
      handle: () => void,
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
  config.collection.schema.properties.createdAt = { ...timestamp, index: true }

  const collection = await db.collection(config.collection)

  for(let middleware in config.middlewares) {
    const { handle, parallel } = config.middlewares[middleware]
    collection[middleware](handle, parallel)
  }

  // const needsMigration = await collection.migrationNeeded()
  // console.log(`${config.collection.name}: ${needsMigration}`)
  // if(needsMigration === true) {
  //   return collection
  // }
}

export let db: Database = null

export const init = async (): Promise<any> => {
  try {
    db = await RxDB.create<DatabaseCollections>({
      name: "nsu",
      adapter: adapter,
      password: "nsu2020nsu2020nsu2020",
      multiInstance: false,
      queryChangeDetection: false
    })

    // const collections = await Promise.all(configs.map(
    await Promise.all(configs.map(
      (config) => configureCollection(db, config))
    )

    // const migrations = collections.filter((collection) => !!collection)
    // if(migrations) return migrations
  } catch(e) {
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
