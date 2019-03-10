import { insert, findMany, destroyOne, destroyMany } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany("clubs_members", filter, options)
  result.items = result.items.map((doc) => doc.toJSON())
  return result
}

const create = async (doc = {}, options = {}) => {
  const result = await insert("clubs_members", doc, options)
  return result.toJSON()
}

const removeOne = async (clubMember, options = {}) => {
  await destroyMany("events_divisions_contestants", { memberId: clubMember.id })
  await destroyMany("events_participants", { memberId: clubMember.id })
  await destroyOne("clubs_members", { id: clubMember.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs_members", filter, options)
  return true
}

export default {
  list, create, removeOne, removeMany
}
