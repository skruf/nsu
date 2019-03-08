import { insertMany, findMany, destroyOne, destroyMany } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany("events_divisions_contestants_results", filter, options)
  result.items = result.items.map((doc) => doc.toJSON())
  return result
}

const createMany = async (doc = {}, options = {}) => {
  const result = await insertMany("events_divisions_contestants_results", doc, options)
  return result.toJSON()
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_divisions_contestants_results", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions_contestants_results", filter, options)
  return true
}

export default {
  list, createMany, removeOne, removeMany
}
