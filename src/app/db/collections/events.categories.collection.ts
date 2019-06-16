import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { getId, getTimestamp } from "~/utils"

export type EventsCategoriesProperties = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

type EventsCategoriesMethods = {}
type EventsCategoriesStatics = {}

export type EventsCategoriesDocument = RxDocument<
  EventsCategoriesProperties,
  EventsCategoriesMethods
>

export type EventsCategoriesCollection = RxCollection<
  EventsCategoriesProperties,
  EventsCategoriesMethods,
  EventsCategoriesStatics
>

const schema: RxJsonSchema = {
  title: "Events categories schema",
  description: "Events categories",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string",
      index: true
    }
  },
  required: [
    "name"
  ]
}

const methods: EventsCategoriesMethods = {}
const statics: EventsCategoriesStatics = {
  count: async function(this: EventsCategoriesCollection) {
    const docs = await this.find().exec()
    return docs.length
  }
}

const preInsert = (data: EventsCategoriesProperties) => {
  const timestamp = getTimestamp()
  data.id = getId()
  data.createdAt = timestamp
  data.updatedAt = timestamp
}

const preRemove = async (data: EventsCategoriesProperties) => {
  await destroyMany("events", {
    categoryId: data.id
  })
}

export default {
  collection: {
    name: "events_categories",
    schema: schema,
    methods: methods,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    },
    preInsert: {
      handle: preInsert,
      parallel: false
    }
  }
}
