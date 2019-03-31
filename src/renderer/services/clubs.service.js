import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { clubsStub } from "@/stubs"

const populate = async (doc) => {
  let range = await doc.populate("rangeId")
  const members = await findMany("clubs_members", { clubId: doc.id })

  const club = doc.toJSON()
  club.membersCount = members.count
  if(range) club.range = range.toJSON()

  return club
}

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(clubsStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("clubs", filter, options)
  result.items = await Promise.all(
    result.items.map((doc) => populate(doc))
  )
  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("clubs", filter, options)
  const club = await populate(doc)
  return club
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const doc = await insert("clubs", data, options)
  const club = await populate(doc)
  // club.membersCount = 0
  return club
}

const removeOne = async (item, options = {}) => {
  await destroyOne("clubs", { id: item.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs", filter, options)
  return true
}

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item)
  const doc = await updateOne("clubs", filter, data, options)
  const club = await populate(doc)
  return club
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
