const schema = {
  title: "Clubs schema",
  description: "Clubs",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    name: {
      type: "string",
      index: true
    },
    leader: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    address: {
      type: "string"
    },
    area: {
      type: "string"
    },
    country: {
      type: "string"
    },
    rangeId: {
      type: "string",
      ref: "ranges"
    }
  },
  required: [
    "name",
    "area",
    "country"
  ]
}

const methods = {}

export default {
  name: "clubs",
  schema: schema,
  methods: methods
}
