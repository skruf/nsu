import {
  insert, findMany, findOne, destroyOne, destroyMany
} from "@/db/queries"

// @TODO: fix search on clubs_members model
// let a
// const result = await findMany("events_participants", filter)
// const ids = result.items.map(({ id }) => id)
// if(options.relations.length) {
//   const collection = options.relations[0].collection
//   const filter = { id: { $in: ids } }
//   const cfg = { search: { fields: options.relations[0].fields } }
//   a = await findMany(collection, filter, cfg)
// }

const populate = async (doc) => {
  const member = await doc.populate("memberId")
  const club = await member.populate("clubId")
  const classes = await doc.populate("classes")

  const participant = doc.toJSON()

  participant.member = member.toJSON()
  participant.member.club = club.toJSON()
  participant.classes = classes.map((d) => d.toJSON())

  return participant
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("events_participants", filter, options)

  result.items = await Promise.all(
    result.items.map((doc) => populate(doc))
  )

  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("events_participants", filter, options)
  const participant = await populate(doc)
  return participant
}

const create = async (data = {}, options = {}) => {
  const doc = await insert("events_participants", data, options)
  const participant = await populate(doc)
  return participant
}

const removeOne = async (participant, options = {}) => {
  await destroyOne("events_participants", { id: participant.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_participants", filter, options)
  return true
}

export default {
  list, select, create, removeOne, removeMany
}
