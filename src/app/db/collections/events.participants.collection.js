import { findMany, destroyMany } from "~/db/queries"

const schema = {
  title: "Events participants schema",
  description: "Events participants",
  version: 1,
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
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    weapons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: {
            type: "string"
          },
          calibre: {
            type: "string"
          },
          classId: {
            type: "string",
            ref: "classes"
          }
        }
      }
    }
  },
  required: [
    "memberId",
    "eventId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  const divisions = await findMany("events_divisions", {
    eventId: data.eventId
  })
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
    methods: methods,
    migrationStrategies: {
      1: (d) => d
    }
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
