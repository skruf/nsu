import { insert, findMany, findOne, destroyOne, destroyMany } from "@/db/queries"

const populate = async (doc) => {
  let club = await doc.populate("organizerId")
  let range = await doc.populate("rangeId")

  const event = doc.toJSON()
  event.club = club.toJSON()
  event.range = range.toJSON()

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
    result.items.map((event) => populate(event))
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

// @TODO: move this garbage to middleware hooks..
const removeOne = async (event, options = {}) => {
  const divisionsFindManyFilter = { eventId: event.id }
  const divisions = await findMany("events_divisions", divisionsFindManyFilter)
  const divisionIds = divisions.items.map((d) => d.toJSON().id)

  await destroyMany("events_divisions_contestants", {
    divisionId: { $in: divisionIds }
  })

  const divisionsDestroyManyFilter = { id: { $in: divisionIds } }
  await destroyMany("events_divisions", divisionsDestroyManyFilter)

  const participantsFilter = { eventId: event.id }
  await destroyMany("events_participants", participantsFilter)

  const eventFilter = { id: event.id }
  await destroyOne("events", eventFilter, options)

  return true
}

const removeMany = () => {
  destroyMany()
}

export default {
  list, select, create, removeOne, removeMany
}
