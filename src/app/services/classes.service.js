import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "~/db/queries"
import { classesStub } from "~/stubs"

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(classesStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("classes", filter, options, true)
  return result
}

const select = async (filter = {}, options = {}) => {
  const result = await findOne("classes", filter, options, true)
  return result
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const result = await insert("classes", data, options, true)
  return result
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("classes", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("classes", filter, options)
  return true
}

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item)
  const result = await updateOne("classes", filter, data, options, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
