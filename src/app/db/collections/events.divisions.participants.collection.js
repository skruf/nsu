import { destroyMany } from "~/db/queries"

const schema = {
  title: "Events divisions participants schema",
  description: "Events divisions participants",
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
  await destroyMany("events_divisions_participants_results", {
    participantId: data.id,
    divisionId: data.divisionId
  })
}

export default {
  collection: {
    name: "events_divisions_participants",
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
