import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany, updateOne
} from "~/db/queries"
import { filterInput } from "~/utils"

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

  const { items: weaponDocs } = await findMany("events_participants_weapons", {
    participantId: doc.id
  })
  const weapons = await Promise.all(
    weaponDocs.map(async (weaponDoc) => {
      const weaponClassDoc = await weaponDoc.populate("classId")
      const weapon = weaponDoc.toJSON()
      weapon.class = weaponClassDoc.toJSON()
      return weapon
    })
  )

  const participant = doc.toJSON()
  participant.member = member.toJSON()
  participant.member.club = club.toJSON()
  participant.weapons = weapons

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

const createOne = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const doc = await insert("events_participants", data, options)
  const participant = await populate(doc)
  return participant
}

const createMany = async (items = {}, options = {}) => {
  const data = items.map((item) => filterInput(item))
  const docs = await insertMany("events_participants", data, options)
  const participants = await Promise.all(
    docs.map((doc) => populate(doc))
  )
  return participants
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

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item)
  const doc = await updateOne("events_participants", filter, data, options)
  const result = await populate(doc)
  return result
}

export default {
  list, createMany, select, createOne, removeOne, removeMany, editOne
}
