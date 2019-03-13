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
      format: "date-time"
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
    "eventId": {
      type: "string",
      ref: "events"
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

export default {
  collection: {
    name: "events_divisions",
    schema: schema,
    methods: methods
  }
}
