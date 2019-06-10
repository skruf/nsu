import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"

type Properties = {
  id: string
  total: number
  hits: number[]
  contestantId: string
  createdAt: string
  updatedAt: string
}

type Methods = {}
type Statics = {}

export type EventsContestantsResultsDocument = RxDocument<
  Properties,
  Methods
>

export type EventsContestantsResultsCollection = RxCollection<
  Properties,
  Methods,
  Statics
>

const schema: RxJsonSchema = {
  title: "Events contestants results schema",
  description: "Events contestants results",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
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
    contestantId: {
      type: "string",
      ref: "events_contestants"
    }
  },
  required: [
    "total",
    "hits",
    "contestantId"
  ]
}

const methods: Methods = {}
const statics: Statics = {}

export default {
  collection: {
    name: "events_contestants_results",
    schema: schema,
    methods: methods,
    statics: statics
  }
}
