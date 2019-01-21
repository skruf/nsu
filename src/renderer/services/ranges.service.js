import { insert, find, findOne, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  const results = await find("ranges", filter, options)
  results.items = results.items.map((doc) => doc.toJSON())
  return results
}

const select = async (filter = {}, options = {}) => {
  const results = await findOne("ranges", filter, options)
  return results.toJSON()
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("ranges", doc, options)
  return results.toJSON()
}

const remove = async (filter, options = {}) => {
  const results = await destroy("ranges", filter, options)
  return results.toJSON()
}

export default {
  list, select, create, remove
}
