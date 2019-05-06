const schema = {
  title: "Events divisions contestants results schema",
  description: "Events divisions contestants results",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    total: {
      type: "number",
      index: true
    },
    hits: {
      type: "array",
      items: {
        type: "number"
      }
    },
    contestantId: {
      type: "string",
      ref: "events_divisions_contestants"
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    }
  },
  required: [
    "total",
    "hits",
    "contestantId",
    "divisionId"
  ]
}

const methods = {}

export default {
  collection: {
    name: "events_divisions_contestants_results",
    schema: schema,
    methods: methods
  }
}
