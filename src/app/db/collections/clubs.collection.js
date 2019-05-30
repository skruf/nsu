import { destroyMany, findMany, updateMany } from "~/db/queries"

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

const preRemove = async (data, doc) => {
  await destroyMany("clubs_members", { clubId: data.id })

  const { items: events } = await findMany("events", {
    organizerId: data.id
  }, {}, true)
  await updateMany("events", events.map(
    (event) => ({ ...event, organizerId: "" })
  ))
}

export default {
  collection: {
    name: "clubs",
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
