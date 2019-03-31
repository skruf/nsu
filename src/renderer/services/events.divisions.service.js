import { insert, findMany, destroyOne, destroyMany } from "@/db/queries"
import { eventsDivisionsStub } from "@/stubs"

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(eventsDivisionsStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany("events_divisions", filter, options, true)
  return result
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const result = await insert("events_divisions", data, options, true)
  return result
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_divisions", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions", filter, options)
  return true
}

export default {
  list, create, removeOne, removeMany
}
