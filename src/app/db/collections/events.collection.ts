import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { ClubsDocument } from "~/db/collections/clubs.collection"
import { RangesDocument } from "~/db/collections/ranges.collection"

export type EventsProperties = {
  id: string
  title: string
  startsAt: string
  endsAt: string
  category: string
  approbated?: boolean
  organizerId?: string
  rangeId?: string
  createdAt: string
  updatedAt: string
  club?: ClubsDocument
  range?: RangesDocument
}

type EventsMethods = {}
type EventsStatics = {}

export type EventsDocument = RxDocument<
  EventsProperties,
  EventsMethods
>

export type EventsCollection = RxCollection<
  EventsProperties,
  EventsMethods,
  EventsStatics
>

const schema: RxJsonSchema = {
  title: "Events schema",
  description: "Events",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    title: {
      type: "string",
      index: true
    },
    startsAt: {
      type: "string",
      format: "date-time",
      index: true
    },
    endsAt: {
      type: "string",
      format: "date-time"
    },
    category: {
      type: "string",
      index: true
    },
    approbated: {
      type: "boolean",
      default: false
    },
    organizerId: {
      type: "string",
      ref: "clubs",
      index: true
    },
    rangeId: {
      type: "string",
      ref: "ranges"
    }
  },
  required: [
    "title",
    "startsAt",
    "endsAt",
    "category"
  ]
}

const methods: EventsMethods = {}
const statics: EventsStatics = {}

const preRemove = async (data: EventsProperties) => {
  await destroyMany("events_divisions", {
    eventId: data.id
  })
  await destroyMany("events_participants", {
    eventId: data.id
  })
}

export default {
  collection: {
    name: "events",
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
