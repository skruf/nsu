const schema = {
  title: "Events contestants results schema",
  description: "Events contestants results",
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
      ref: "events_contestants"
    }
  },
  required: [
    "total",
    "hits",
    "contestantId"
  ]
}

const methods = {}

export default {
  collection: {
    name: "events_contestants_results",
    schema: schema,
    methods: methods
  }
}
