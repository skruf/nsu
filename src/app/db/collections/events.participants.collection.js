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
    // weaponIds: {
    //   type: "array",
    //   ref: "events_participants_weapons",
    //   items: {
    //     type: "string"
    //   }
    // }
  },
  required: [
    "number",
    "memberId",
    "eventId"
  ]
}

const methods = {}

const preRemove = async (data, doc) => {
  // const divisions = await findMany("events_divisions", {
  //   eventId: data.eventId
  // })
  // const divisionIds = divisions.items.map((d) => d.toJSON().id)
  await destroyMany("events_divisions_participants", {
    participantId: data.id
    // divisionId: { $in: divisionIds }
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
