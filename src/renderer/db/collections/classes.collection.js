import { destroyMany, findMany } from "@/db/queries"

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
  // @TODO: refactor hack..
  const { items } = await findMany("events_participants")
  const participants = items.filter(
    (participant) => participant.weapons.map(
      ({ classId }) => classId
    ).includes(data.id)
  ).map(({ id }) => id)

  await destroyMany("events_participants", { id: { $in: participants } })
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
