import { destroyMany } from "~/db/queries"

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

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_contestants", {
    divisionId: data.id
  })
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
