import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne,
  QueryOptions, QueryFilter, QueryResult
} from "~/db/queries"
import { rangesStub } from "~/stubs"
import { filterInput } from "~/utils"
import { RangesProperties } from "~/db/collections/ranges.collection"

const list = async (filter: QueryFilter, options: QueryOptions): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("ranges", filter, options, true)
  return result
}

const select = async (filter: QueryFilter): Promise<RangesProperties> => {
  const result = await findOne("ranges", filter, true)
  return result
}

const create = async (item: RangesProperties): Promise<RangesProperties> => {
  const data = filterInput(item, rangesStub)
  const result = await insert("ranges", data, true)
  return result
}

const removeOne = async (item: { id: string }): Promise<true> => {
  await destroyOne("ranges", item)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("ranges", filter)
  return true
}

const editOne = async (item: RangesProperties): Promise<RangesProperties> => {
  const filter = { id: item.id }
  const data = filterInput(item, rangesStub)
  const result = await updateOne("ranges", filter, data, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
