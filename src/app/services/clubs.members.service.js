import {
  insert, findMany, destroyOne, destroyMany, updateOne
} from "~/db/queries"
import { clubsMembersStub } from "~/stubs"
import { filterInput } from "~/utils"

const list = async (filter = {}, options = {}) => {
  const result = await findMany("clubs_members", filter, options, true)
  return result
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item, clubsMembersStub)
  const result = await insert("clubs_members", data, options, true)
  return result
}

const removeOne = async (clubMember, options = {}) => {
  await destroyOne("clubs_members", { id: clubMember.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs_members", filter, options)
  return true
}

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item, clubsMembersStub)
  const result = await updateOne("clubs_members", filter, data, options, true)
  return result
}

export default {
  list, create, removeOne, removeMany, editOne
}
