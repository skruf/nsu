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

export default {
  name: "events",
  schema: schema,
  methods: methods
}
