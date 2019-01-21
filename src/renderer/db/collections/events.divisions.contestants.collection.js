const schema = {
  title: "Events divisions contestants schema",
  description: "Events divisions contestants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    time: {
      type: "string"
    },
    calibre: {
      type: "string"
    },
    memberId: {
      type: "string",
      ref: "clubsMembers"
    },
    classId: {
      type: "string",
      ref: "classes"
    }
  },
  required: [
    "time",
    "calibre",
    "memberId",
    "classId"
  ]
}

const methods = {}

export default {
  name: "events_divisions_contestants",
  schema: schema,
  methods: methods
}
