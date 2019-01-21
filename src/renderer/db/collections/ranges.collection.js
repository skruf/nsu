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
    lat: {
      type: "string"
    },
    lng: {
      type: "string"
    },
    type: {
      type: "string"
    },
    createdAt: {
      type: "string"
    },
    updatedAt: {
      type: "string"
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
