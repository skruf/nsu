import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne
} from "@/db/queries"
import { eventsStub } from "@/stubs"

const populate = async (doc) => {
  let club = await doc.populate("organizerId")
  let range = await doc.populate("rangeId")

  const event = doc.toJSON()
  if(club) event.club = club.toJSON()
  if(range) event.range = range.toJSON()

  return event
}

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(eventsStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}, fetchMode) => {
  if(fetchMode === "upcoming") {
    filter.startsAt = { $gte: new Date() }
  }

  if(fetchMode === "history") {
    filter.startsAt = { $lte: new Date() }
  }

  const result = await findMany("events", filter, options)
  result.items = await Promise.all(
    result.items.map((doc) => populate(doc))
  )
  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("events", filter, options)
  const event = await populate(doc)
  return event
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item)
  const doc = await insert("events", data, options)
  const event = await populate(doc)
  return event
}

const removeOne = async (event, options = {}) => {
  await destroyOne("events", { id: event.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events", filter, options)
  return true
}

const editOne = async (item, options = {}) => {
  const filter = { id: item.id }
  const data = filterInput(item)
  const doc = await updateOne("events", filter, data, options)
  const result = await populate(doc)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
