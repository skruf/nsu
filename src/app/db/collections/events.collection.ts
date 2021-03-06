import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { ClubsDocument } from "~/db/collections/clubs.collection"
import { RangesDocument } from "~/db/collections/ranges.collection"
import { EventsCategoriesDocument } from "~/db/collections/events.categories.collection"

export type EventsProperties = {
  id: string
  title: string
  startsAt: string
  endsAt: string
  approbated?: boolean
  categoryId?: string
  organizerId?: string
  rangeId?: string
  createdAt: string
  updatedAt: string
  club?: ClubsDocument
  range?: RangesDocument
  category: EventsCategoriesDocument
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
  version: 1,
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
    approbated: {
      type: "boolean",
      default: false
    },
    categoryId: {
      type: "string",
      ref: "events_categories",
      index: true
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
    "endsAt"
  ]
}

const methods: EventsMethods = {}
const statics: EventsStatics = {}

const migrationStrategies = {
  1: async (event: EventsProperties) => {
    delete event.category
    return event
  }
}

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
