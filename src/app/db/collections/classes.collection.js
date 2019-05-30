import { destroyMany, findMany } from "~/db/queries"

const schema = {
  title: "Classes schema",
  description: "Classes",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    number: {
      type: "string",
      index: true
    },
    name: {
      type: "string",
      index: true
    },
    category: {
      type: "string",
      index: true
    },
    condition: {
      type: "string"
    }
  },
  required: [
    "number",
    "name",
    "category",
    "condition"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_participants_weapons", {
    classId: data.id
  })
}

export default {
  collection: {
    name: "classes",
    schema: schema,
    methods: methods
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
