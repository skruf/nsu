import { destroyMany } from "@/db/queries"

const schema = {
  title: "Events divisions contestants schema",
  description: "Events divisions contestants",
  version: 1,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    time: {
      type: "string",
      index: true
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
    },
    weapon: {
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
  },
  required: [
    "time",
    "divisionId",
    "memberId",
    "weapon"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_divisions_contestants_results",
    { contestantId: data.id }
  )
}

export default {
  collection: {
    name: "events_divisions_contestants",
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
