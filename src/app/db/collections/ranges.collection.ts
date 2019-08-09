import { db } from "~/db"
import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"

export type RangesProperties = {
  id: string
  name: string
  address?: string
  area: string
  country: string
  lat?: string
  lng?: string
  type: string
  createdAt: string
  updatedAt: string
}

type RangesMethods = {}

type RangesStatics = {
  count: (collection: RangesCollection) => Promise<number>
}

export type RangesDocument = RxDocument<
  RangesProperties,
  RangesMethods
>

export type RangesCollection = RxCollection<
  RangesProperties,
  RangesMethods,
  RangesStatics
>

const schema: RxJsonSchema = {
  title: "Ranges schema",
  description: "Ranges",
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
    },
    address: {
      type: "string"
    },
    area: {
      type: "string"
    },
    country: {
      type: "string",
      index: true
    },
    lat: {
      type: "string"
    },
    lng: {
      type: "string"
    },
    type: {
      type: "string",
      index: true
    }
  },
  required: [
    "name",
    "area",
    "country",
    "type"
  ]
}

const methods: RangesMethods = {}

const statics: RangesStatics = {
  count: async function(collection: RangesCollection) {
    const docs = await collection.find().exec()
    return docs.length
  }
}

const preRemove = async (data: RangesProperties): Promise<void> => {
  const clubs = await db.clubs.find({ rangeId: data.id })
  await clubs.update({ $set: { rangeId: "" } })

  const events = await db.events.find({ rangeId: data.id })
  await events.update({ $set: { rangeId: "" } })
}

export default {
  collection: {
    name: "ranges",
    schema: schema,
    methods: methods,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
