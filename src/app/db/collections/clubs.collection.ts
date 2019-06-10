import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany, findMany, updateMany } from "~/db/queries"
import { EventsDocument } from "~/db/collections/events.collection"
import { RangesProperties } from "~/db/collections/ranges.collection"

export type ClubsProperties = {
  id: string
  name: string
  leader?: string
  emailAddress?: string
  address?: string
  area: string
  country: string
  rangeId?: string
  createdAt: string
  updatedAt: string
  membersCount?: number
  range: RangesProperties
}

type ClubsMethods = {}
type ClubsStatics = {}

export type ClubsDocument = RxDocument<
  ClubsProperties,
  ClubsMethods
>

export type ClubsCollection = RxCollection<
  ClubsProperties,
  ClubsMethods,
  ClubsStatics
>

const schema: RxJsonSchema = {
  title: "Clubs schema",
  description: "Clubs",
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
    leader: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    address: {
      type: "string"
    },
    area: {
      type: "string"
    },
    country: {
      type: "string"
    },
    rangeId: {
      type: "string",
      ref: "ranges"
    }
  },
  required: [
    "name",
    "area",
    "country"
  ]
}

const methods: ClubsMethods = {}
const statics: ClubsStatics = {}

const preRemove = async (data: ClubsProperties) => {
  await destroyMany("clubs_members", { clubId: data.id })

  const { items: events } = await findMany("events", {
    organizerId: data.id
  }, {}, true)
  await updateMany("events", events.map(
    (event: EventsDocument) => ({ ...event, organizerId: "" })
  ))
}

export default {
  collection: {
    name: "clubs",
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
