import {
  insert, findMany, findOne, destroyOne, destroyMany
} from "@/db/queries"

const populate = async (doc) => {
  let club = await doc.populate("organizerId")
  let range = await doc.populate("rangeId")

  const event = doc.toJSON()
  if(club) event.club = club.toJSON()
  if(range) event.range = range.toJSON()

  return event
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

const create = async (data = {}, options = {}) => {
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

export default {
  list, select, create, removeOne, removeMany
}
