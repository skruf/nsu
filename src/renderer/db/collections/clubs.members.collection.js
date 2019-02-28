const schema = {
  title: "Clubs members schema",
  description: "Clubs members",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    firstName: {
      type: "string"
    },
    lastName: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    country: {
      type: "string"
    },
    phoneNumber: {
      type: "string"
    },
    clubId: {
      type: "string",
      ref: "clubs"
    }
  },
  required: [
    "firstName",
    "lastName",
    "country",
    "clubId"
  ]
}

const methods = {}

export default {
  name: "clubs_members",
  schema: schema,
  methods: methods
}
