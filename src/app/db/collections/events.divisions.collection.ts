import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"

type Properties = {
  id: string
  name: string
  day: string
  time: string
  distance?: string
  stands: number
  eventId: string
  createdAt: string
  updatedAt: string
}

type Methods = {}
type Statics = {}

export type EventsDivisionsDocument = RxDocument<
  Properties,
  Methods
>

export type EventsDivisionsCollection = RxCollection<
  Properties,
  Methods,
  Statics
>

const schema: RxJsonSchema = {
  title: "Events divisions schema",
  description: "Events divisions",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string"
    },
    day: {
      type: "string",
      format: "date",
      index: true
    },
    time: {
      type: "string"
    },
    distance: {
      type: "string"
    },
    stands: {
      type: "number"
    },
    eventId: {
      type: "string",
      ref: "events"
    }
  },
  required: [
    "name",
    "day",
    "time",
    "stands",
    "eventId"
  ]
}

const methods: Methods = {}
const statics: Statics = {}

const preRemove = async (data: Properties) => {
  await destroyMany("events_contestants", {
    divisionId: data.id
  })
}

export default {
  collection: {
    name: "events_divisions",
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
