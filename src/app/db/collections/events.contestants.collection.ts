import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"
import { getId, getTimestamp, filterInput } from "~/utils"
import { eventsContestantsStub } from "~/stubs"

export type EventsContestantsProperties = {
  id: string
  stand: number
  total: number
  hits: number[]
  notes: string[]
  eventId: string
  divisionId: string
  memberId: string
  participantId: string
  weaponId: string
  createdAt: string
  updatedAt: string
}

type EventsContestantsMethods = {}
type EventsContestantsStatics = {}

export type EventsContestantsDocument = RxDocument<
  EventsContestantsProperties,
  EventsContestantsMethods
>

export type EventsContestantsCollection = RxCollection<
  EventsContestantsProperties,
  EventsContestantsMethods,
  EventsContestantsStatics
>

const schema: RxJsonSchema = {
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
    total: {
      type: "number",
      index: true
    },
    hits: {
      type: "array",
      items: {
        type: "number"
      }
    },
    notes: {
      type: "array",
      items: {
        type: "string"
      }
    },
    eventId: {
      type: "string",
      ref: "events"
    },
    divisionId: {
      type: "string",
      ref: "events_divisions"
    },
    memberId: {
      type: "string",
      ref: "clubs_members"
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
    "eventId",
    "divisionId",
    "participantId",
    "weaponId"
  ]
}

const methods: EventsContestantsMethods = {}
const statics: EventsContestantsStatics = {
  count: async function(this: EventsContestantsCollection) {
    const docs = await this.find().exec()
    return docs.length
  }
}

const preInsert = (data: EventsContestantsProperties) => {
  const timestamp = getTimestamp()
  data.id = getId()
  data.createdAt = timestamp
}

const preSave = (data: EventsContestantsProperties) => {
  const timestamp = getTimestamp()
  const d = filterInput(data, eventsContestantsStub)
  d.updatedAt = timestamp
  return d
}

const preRemove = async (data: EventsContestantsProperties) => {
  await destroyMany("events_contestants_results", {
    contestantId: data.id
  })
}

export default {
  collection: {
    name: "events_contestants",
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
