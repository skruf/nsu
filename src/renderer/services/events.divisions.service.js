import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { eventsDivisionsStub } from "@/stubs"
import { filterInput } from "@/utils"

const list = async (filter = {}, options = {}, fetchMode) => {
  const divisions = await findMany("events_divisions", filter, options, true)
  return divisions
}

const select = async (filter = {}, options = {}) => {
  const division = await findOne("events_divisions", filter, options, true)
  return division
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item, eventsDivisionsStub)
  const division = await insert("events_divisions", data, options, true)
  return division
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

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item, eventsDivisionsStub)
  const division = await updateOne("events_divisions", filter, data, options, true)
  return division
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
