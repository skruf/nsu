import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { getId, getTimestamp, filterInput } from "~/utils"
import { eventsParticipantsWeaponsStub } from "~/stubs"

export type EventsParticipantsWeaponsProperties = {
  id?: string
  calibre: string
  classId: string
  participantId: string
  createdAt?: string
  updatedAt?: string
}

type EventsParticipantsWeaponsMethods = {}
type EventsParticipantsWeaponsStatics = {}

export type EventsParticipantsWeaponsDocument = RxDocument<
  EventsParticipantsWeaponsProperties,
  EventsParticipantsWeaponsMethods
>

export type EventsParticipantsWeaponsCollection = RxCollection<
  EventsParticipantsWeaponsProperties,
  EventsParticipantsWeaponsMethods,
  EventsParticipantsWeaponsStatics
>

const schema: RxJsonSchema = {
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

const methods: EventsParticipantsWeaponsMethods = {}
const statics: EventsParticipantsWeaponsStatics = {}

const preInsert = (data: EventsParticipantsWeaponsProperties) => {
  const timestamp = getTimestamp()
  data.id = getId()
  data.createdAt = timestamp
}

const preSave = (data: EventsParticipantsWeaponsProperties) => {
  const timestamp = getTimestamp()
  const d = filterInput(data, eventsParticipantsWeaponsStub)
  d.updatedAt = timestamp
  return d
}

const preRemove = async (data: EventsParticipantsWeaponsProperties) => {
  await destroyMany("events_contestants", {
    weaponId: data.id
  })
}

export default {
  collection: {
    name: "events_participants_weapons",
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
    },
    preSave: {
      handle: preSave,
      parallel: false
    }
  }
}
