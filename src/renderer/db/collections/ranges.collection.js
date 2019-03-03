const schema = {
  title: "Ranges schema",
  description: "Ranges",
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
    address: {
      type: "string"
    },
    area: {
      type: "string"
    },
    country: {
      type: "string",
      index: true
    },
    lat: {
      type: "string"
    },
    lng: {
      type: "string"
    },
    type: {
      type: "string",
      index: true
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
  name: "ranges",
  schema: schema,
  methods: methods
}
