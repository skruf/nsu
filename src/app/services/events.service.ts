import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne,
  QueryOptions, QueryFilter, QueryResult
} from "~/db/queries"
import { eventsStub } from "~/stubs"
import { filterInput } from "~/utils"
import { EventsDocument, EventsProperties } from "~/db/collections/events.collection"

const populate = async (doc: EventsDocument): Promise<EventsProperties> => {
  let club = await doc.populate("organizerId")
  let range = await doc.populate("rangeId")

  const event = doc.toJSON()
  if(club) event.club = club.toJSON()
  if(range) event.range = range.toJSON()

  return event
}

const list = async (
  filter: QueryFilter,
  options: QueryOptions,
  fetchMode?: "upcoming" | "history"
): Promise<{
  items: QueryResult[],
  count: number
}> => {
  if(fetchMode === "upcoming") {
    filter.startsAt = { $gte: new Date() }
  }

  if(fetchMode === "history") {
    filter.startsAt = { $lte: new Date() }
  }

  const result = await findMany("events", filter, options)
  result.items = await Promise.all(
    result.items.map((doc: EventsDocument) => populate(doc))
  )
  return result
}

const select = async (filter: QueryFilter): Promise<EventsProperties | null> => {
  const doc = await findOne("events", filter, false)
  if(!doc) return null
  const event = await populate(doc)
  return event
}

const create = async (item: EventsProperties): Promise<EventsProperties> => {
  const data = filterInput(item, eventsStub)
  const doc = await insert("events", data, false)
  const event = await populate(doc)
  return event
}

const removeOne = async (event: { id: string }): Promise<true> => {
  await destroyOne("events", { id: event.id })
  return true
}

const removeMany = async (items: { id: string }[], options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events", filter, options)
  return true
}

const editOne = async (item: EventsProperties): Promise<EventsProperties> => {
  const filter = { id: item.id }
  const data = filterInput(item, eventsStub)
  const doc = await updateOne("events", filter, data, false)
  const result = await populate(doc)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
