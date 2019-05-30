import { findMany, updateMany } from "~/db/queries"

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
    "country",
    "type"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  const { items: clubs } = await findMany("clubs", {
    rangeId: data.id
  }, {}, true)
  await updateMany("clubs", clubs.map(
    (club) => ({ ...club, rangeId: "" })
  ))

  const { items: events } = await findMany("events", {
    rangeId: data.id
  }, {}, true)
  await updateMany("events", events.map(
    (event) => ({ ...event, rangeId: "" })
  ))
}

export default {
  collection: {
    name: "ranges",
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
