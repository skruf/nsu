import { findMany, destroyMany } from "~/db/queries"

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
    }
  },
  required: [
    "number",
    "memberId",
    "eventId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  await destroyMany("events_contestants", {
    participantId: data.id
  })
  await destroyMany("events_participants_weapons", {
    participantId: data.id
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
