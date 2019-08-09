import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"

export type EventsDivisionsContestantsDocument = RxDocument<any, any>
export type EventsDivisionsContestantsCollection = RxCollection<any, any, any>

const schema: RxJsonSchema = {
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
    }
    // weapon: {
    //   id: {
    //     type: "string"
    //   },
    //   calibre: {
    //     type: "string"
    //   },
    //   classId: {
    //     type: "string",
    //     ref: "classes"
    //   }
    // }
  },
  required: [
    "time",
    "divisionId",
    "memberId",
    "weapon"
  ]
}

const migrationStrategies = {
  1: (): null =>  null
}

export default {
  collection: {
    name: "events_divisions_contestants",
    schema: schema,
    migrationStrategies: migrationStrategies
  }
}
