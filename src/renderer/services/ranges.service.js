import { insert, findMany, findOne, destroyOne, destroyMany } from "@/db/queries"

const list = async (filter = {}, options = {}) => {
  const result = await findMany("ranges", filter, options)
  result.items = result.items.map((doc) => doc.toJSON())
  return result
}

const select = async (filter = {}, options = {}) => {
  const result = await findOne("ranges", filter, options)
  return result.toJSON()
}

const create = async (doc = {}, options = {}) => {
  const result = await insert("ranges", doc, options)
  return result.toJSON()
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("ranges", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("ranges", filter, options)
  return true
}

export default {
  list, select, create, removeOne, removeMany
}
