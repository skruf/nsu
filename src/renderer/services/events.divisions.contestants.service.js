import { insert, find, findOne, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const results = await find("events_divisions_contestants", filter, options)
  return results
}

const select = async (filter = {}, options = {}) => {
  const results = await findOne("events_divisions_contestants", filter, options)
  return results
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("events_divisions_contestants", doc, options)
  return results
}

const remove = async (filter, options = {}) => {
  const results = await destroy("events_divisions_contestants", filter, options)
  return results
}

export default {
  list, select, create, remove
}
