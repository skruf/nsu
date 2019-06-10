import { RxJsonSchema, RxCollection, RxDocument } from "rxdb"
import { destroyMany } from "~/db/queries"

export type ClubsMembersProperties = {
  id: string
  firstName: string
  lastName: string
  emailAddress?: string
  country: string
  phoneNumber?: string
  clubId: string
  createdAt: string
  updatedAt: string
}

type ClubsMembersMethods = {}
type ClubsMembersStatics = {}

export type ClubsMembersDocument = RxDocument<
  ClubsMembersProperties,
  ClubsMembersMethods
>

export type ClubsMembersCollection = RxCollection<
  ClubsMembersProperties,
  ClubsMembersMethods,
  ClubsMembersStatics
>

const schema: RxJsonSchema = {
  title: "Clubs members schema",
  description: "Clubs members",
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    firstName: {
      type: "string",
      index: true
    },
    lastName: {
      type: "string"
    },
    emailAddress: {
      type: "string"
    },
    country: {
      type: "string"
    },
    phoneNumber: {
      type: "string"
    },
    clubId: {
      type: "string",
      ref: "clubs"
    }
  },
  required: [
    "firstName",
    "lastName",
    "country",
    "clubId"
  ]
}

const methods: ClubsMembersMethods = {}
const statics: ClubsMembersStatics = {}

const preRemove = async (data: ClubsMembersProperties) => {
  await destroyMany("events_participants", {
    memberId: data.id
  })
}

export default {
  collection: {
    name: "clubs_members",
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
