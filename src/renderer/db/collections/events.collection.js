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
      type: "string"
    },
    startsAt: {
      type: "string"
    },
    endsAt: {
      type: "string"
    },
    category: {
      type: "string"
    },
    approbated: {
      type: "boolean",
      default: false
    },
    organizerId: {
      type: "string",
      ref: "clubs"
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
