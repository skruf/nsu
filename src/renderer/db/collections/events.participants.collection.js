const schema = {
  title: "Events participants schema",
  description: "Events participants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    classes: {
      type: "array",
      ref: "classes",
      items: {
        type: "string"
      }
    },
    calibres: {
      type: "array"
    }
  },
  required: [
    "memberId",
    "eventId"
  ]
}

const methods = {}

export default {
  collection: {
    name: "events_participants",
    schema: schema,
    methods: methods
  }
}
