import { insert, find, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const results = await find("clubs_members", filter, options)
  results.items = results.items.map((doc) => doc.toJSON())
  return results
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("clubs_members", doc, options)
  return results.toJSON()
}

const remove = async (filter, options = {}) => {
  await destroy("clubs_members", filter, options)
  return true
}

export default {
  list, create, remove
}
