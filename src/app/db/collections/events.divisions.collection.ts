import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"

export type EventsDivisionsProperties = {
  id: string
  name: string
  day: string
  time: string
  distance?: string
  stands: number
  eventId: string
  createdAt: string
  updatedAt: string
  startsAt?: string
  endsAt: string
  interval: string
}

type EventsDivisionsMethods = {}
type EventsDivisionsStatics = {}

export type EventsDivisionsDocument = RxDocument<
  EventsDivisionsProperties,
  EventsDivisionsMethods
>

export type EventsDivisionsCollection = RxCollection<
  EventsDivisionsProperties,
  EventsDivisionsMethods,
  EventsDivisionsStatics
>

const schema: RxJsonSchema = {
  title: "Events divisions schema",
  description: "Events divisions",
  version: 1,
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

const methods: EventsDivisionsMethods = {}
const statics: EventsDivisionsStatics = {}

const migrationStrategies = {
  1: (division: EventsDivisionsProperties) => {
    const datetime = division.day.split("T")
    division.day = datetime[0]
    division.time = datetime[1]
    delete division.startsAt
    delete division.endsAt
    delete division.interval
    division.stands = 5
    return division
  }
}

const preRemove = async (data: EventsDivisionsProperties) => {
  await destroyMany("events_contestants", {
    divisionId: data.id
  })
}

export default {
  collection: {
    name: "events_divisions",
    schema: schema,
    methods: methods,
    statics: statics,
    migrationStrategies: migrationStrategies
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
