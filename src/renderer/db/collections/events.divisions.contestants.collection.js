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
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    classId: {
      type: "string",
      ref: "classes"
    }
  },
  required: [
    "time",
    "calibre",
    "divisionId",
    "memberId",
    "classId"
  ]
}

const methods = {}

export default {
  collection: {
    name: "events_divisions_contestants",
    schema: schema,
    methods: methods
  }
}
