import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { getId, getTimestamp } from "~/utils"
import { db } from "~/db"

export type EventsParticipantsProperties = {
  id: string
  number: number | string
  memberId: string
  eventId: string
  createdAt: string
  updatedAt: string
  weapons?: []
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
  version: 1,
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
      ref: "clubs_members",
      index: true
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

const migrationStrategies = {
  1: async (participant: EventsParticipantsProperties) => {
    if(!participant.number) {
      participant.number = 0
    } else if(typeof participant.number === "string") {
      participant.number = parseInt(participant.number, 10)
    }

    await Promise.all(
      participant.weapons.map((weapon) => {
        return db.events_participants_weapons.insert({
          calibre: weapon.calibre,
          classId: weapon.classId,
          participantId: participant.id
        })
      })
    )

    delete participant.weapons
    return participant
  }
}

const preInsert = (data: EventsParticipantsProperties) => {
  const timestamp = getTimestamp()
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
    statics: statics,
    migrationStrategies: migrationStrategies
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
