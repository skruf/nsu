import { findMany, destroyMany } from "@/db/queries"

const schema = {
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
    "category",
    "organizerId",
    "rangeId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  const divisions = await findMany("events_divisions", { eventId: data.id })
  const divisionIds = divisions.items.map((d) => d.toJSON().id)
  await destroyMany("events_divisions", { id: { $in: divisionIds } })
  await destroyMany("events_participants", { eventId: data.id })
}

export default {
  collection: {
    name: "events",
    schema: schema,
    methods: methods
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
