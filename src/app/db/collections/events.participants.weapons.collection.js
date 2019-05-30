import { findMany, destroyMany } from "~/db/queries"

const schema = {
  title: "Events participants weapons schema",
  description: "Events participants weapons",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    calibre: {
      type: "string"
    },
    classId: {
      type: "string",
      ref: "classes"
    },
    participantId: {
      type: "string",
      ref: "events_participants"
    }
  },
  required: [
    "calibre",
    "classId",
    "participantId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_divisions_participants", {
    weaponId: data.id
  })
}

export default {
  collection: {
    name: "events_participants_weapons",
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
