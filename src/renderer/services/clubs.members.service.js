import { insert, find, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const results = await find("clubsMembers", filter, options)
  return results
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("clubsMembers", doc, options)
  return results
}

const remove = async (filter, options = {}) => {
  const results = await destroy("clubsMembers", filter, options)
  return results
}

export default {
  list, create, remove
}
