import { findMany, destroyMany } from "@/db/queries"

const schema = {
  title: "Events participants schema",
  description: "Events participants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    classes: {
      type: "array",
      ref: "classes",
      items: {
        type: "string"
      }
    },
    calibres: {
      type: "array"
    }
  },
  required: [
    "memberId",
    "eventId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  const divisionsFilter = { eventId: data.eventId }
  const divisions = await findMany("events_divisions", divisionsFilter)
  const divisionIds = divisions.items.map((d) => d.toJSON().id)

  await destroyMany("events_divisions_contestants", {
    memberId: data.memberId,
    divisionId: { $in: divisionIds }
  })
}

export default {
  collection: {
    name: "events_participants",
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
