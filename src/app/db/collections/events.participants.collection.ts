import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import DB from "~/db"
import { getId, getTimestamp } from "~/utils"

export type EventsParticipantsProperties = {
  id: string
  number: number
  memberId: string
  eventId: string
  createdAt: string
  updatedAt: string
}

type EventsParticipantsMethods = {}
type EventsParticipantsStatics = {}

export type EventsParticipantsDocument = RxDocument<
  EventsParticipantsProperties,
  EventsParticipantsMethods
>

export type EventsParticipantsCollection = RxCollection<
  EventsParticipantsProperties,
  EventsParticipantsMethods,
  EventsParticipantsStatics
>

const schema: RxJsonSchema = {
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
      type: "number",
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

const methods: EventsParticipantsMethods = {}
const statics: EventsParticipantsStatics = {
  count: async function(this: EventsParticipantsCollection) {
    const docs = await this.find().exec()
    return docs.length
  }
}

const preInsert = async (data: EventsParticipantsProperties) => {
  const db = await DB.get()
  const participants = await db.events_participants.find({
    eventId: data.eventId
  }).exec()
  const numbers = participants.map(({ number }) => number)
  const timestamp = getTimestamp()
  data.number = (Math.max(...numbers) | 0) + 1
  data.id = getId()
  data.createdAt = timestamp
  data.updatedAt = timestamp
}

const preRemove = async (data: EventsParticipantsProperties) => {
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
    methods: methods,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    },
    preInsert: {
      handle: preInsert,
      parallel: false
    }
  }
}
