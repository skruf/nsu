import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne,
  QueryOptions, QueryFilter, QueryResult
} from "~/db/queries"
import { eventsDivisionsStub } from "~/stubs"
import { filterInput } from "~/utils"
import { EventsDivisionsProperties } from "~/db/collections/events.divisions.collection"

const list = async (filter: QueryFilter, options: QueryOptions): Promise<{
  items: QueryResult[], count: number
}> => {
  const divisions = await findMany("events_divisions", filter, options, true)
  return divisions
}

const select = async (filter: QueryFilter): Promise<EventsDivisionsProperties | null> => {
  const division = await findOne("events_divisions", filter, true)
  return division
}

const create = async (item: EventsDivisionsProperties): Promise<EventsDivisionsProperties> => {
  const data = filterInput(item, eventsDivisionsStub)
  const division = await insert("events_divisions", data, true)
  return division
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("events_divisions", { id: item.id })
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions", filter)
  return true
}

const editOne = async (item: EventsDivisionsProperties): Promise<EventsDivisionsProperties> => {
  const filter = { id: item.id }
  const data = filterInput(item, eventsDivisionsStub)
  const division = await updateOne("events_divisions", filter, data, true)
  return division
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
