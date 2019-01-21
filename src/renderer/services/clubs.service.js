import { insert, find, findOne, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const results = await find("clubs", filter, options)
  return results
}

const select = async (filter = {}, options = {}) => {
  const results = await findOne("clubs", filter, options)
  return results
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("clubs", doc, options)
  return results
}

const remove = async (filter, options = {}) => {
  const results = await destroy("clubs", filter, options)
  return results
}

export default {
  list, select, create, remove
}
