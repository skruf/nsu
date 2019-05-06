import { destroyMany } from "@/db/queries"

const schema = {
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
      format: "date-time",
      index: true
    },
    startsAt: {
      type: "string"
    },
    endsAt: {
      type: "string"
    },
    interval: {
      type: "string"
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    distance: {
      type: "string"
    }
  },
  required: [
    "name",
    "day",
    "startsAt",
    "endsAt",
    "interval",
    "eventId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_divisions_contestants", { divisionId: data.id })
}

export default {
  collection: {
    name: "events_divisions",
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
