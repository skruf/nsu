import { insert, findMany, findOne, destroyOne, destroyMany } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany("events_divisions_contestants", filter, options)
  result.items = result.items.map((doc) => doc.toJSON())
  return result
}

const select = async (filter = {}, options = {}) => {
  const result = await findOne("events_divisions_contestants", filter, options)
  return result.toJSON()
}

const create = async (doc = {}, options = {}) => {
  const result = await insert("events_divisions_contestants", doc, options)
  return result.toJSON()
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_divisions_contestants", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions_contestants", filter, options)
  return true
}

export default {
  list, select, create, removeOne, removeMany
}
