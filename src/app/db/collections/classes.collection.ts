import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"

export type ClassesProperties = {
  id: string
  number: string
  name: string
  category: string
  condition: string
  createdAt: string
  updatedAt: string
}

type ClassesMethods = {}
type ClassesStatics = {}

export type ClassesDocument = RxDocument<
  ClassesProperties,
  ClassesMethods
>

export type ClassesCollection = RxCollection<
  ClassesProperties,
  ClassesMethods,
  ClassesStatics
>

const schema: RxJsonSchema = {
  title: "Classes schema",
  description: "Classes",
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
    name: {
      type: "string",
      index: true
    },
    category: {
      type: "string",
      index: true
    },
    condition: {
      type: "string"
    }
  },
  required: [
    "number",
    "name",
    "category",
    "condition"
  ]
}

const methods: ClassesMethods = {}
const statics: ClassesStatics = {}

const preRemove = async (data: ClassesProperties) => {
  await destroyMany("events_participants_weapons", {
    classId: data.id
  })
}

export default {
  collection: {
    name: "classes",
    schema: schema,
    methods: methods,
    statics: statics
  },
  middlewares: {
    preRemove: {
      handle: preRemove,
      parallel: false
    }
  }
}
