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
    },
    updatedAt: {
      type: "string",
      format: "date-time"
    },
    createdAt: {
      type: "string",
      format: "date-time",
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

const postRemove = async (plainData, rxDocument) => {
  console.log("-------------")
  console.log(plainData)
  console.log("-------------")
  console.log(rxDocument)
  console.log("-------------")
}

export default {
  collection: {
    name: "clubs",
    schema: schema,
    methods: methods
  },
  middlewares: [
    {
      hook: "postRemove",
      handle: postRemove,
      parallel: false
    }
  ]
}
