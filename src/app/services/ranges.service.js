import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "~/db/queries"
import { rangesStub } from "~/stubs"

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(rangesStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("ranges", filter, options, true)
  return result
}

const select = async (filter = {}, options = {}) => {
  const result = await findOne("ranges", filter, options, true)
  return result
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const result = await insert("ranges", data, options, true)
  return result
}

const removeOne = async (item, options = {}) => {
  await destroyOne("ranges", item, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("ranges", filter, options)
  return true
}

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item)
  const result = await updateOne("ranges", filter, data, options, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
