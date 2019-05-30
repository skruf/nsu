import { destroyMany } from "~/db/queries"

const schema = {
  title: "Events contestants schema",
  description: "Events contestants",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    stand: {
      type: "number",
      index: true
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    participantId: {
      type: "string",
      ref: "events_participants"
    },
    weaponId: {
      type: "string",
      ref: "events_participants_weapons"
    }
  },
  required: [
    "stand",
    "divisionId",
    "participantId",
    "weaponId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_contestants_results", {
    contestantId: data.id
  })
}

export default {
  collection: {
    name: "events_contestants",
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
