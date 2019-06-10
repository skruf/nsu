import {
  insert, findMany, findOne, destroyOne, destroyMany, updateOne,
  QueryOptions, QueryFilter, QueryResult
} from "~/db/queries"
import { classesStub } from "~/stubs"
import { filterInput } from "~/utils"
import { ClassesProperties } from "~/db/collections/classes.collection"

const list = async (filter: QueryFilter, options: QueryOptions): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("classes", filter, options, true)
  return result
}

const select = async (filter: QueryFilter): Promise<ClassesProperties | null> => {
  const result = await findOne("classes", filter, true)
  return result
}

const create = async (item: ClassesProperties) => {
  const data = filterInput(item, classesStub)
  const result = await insert("classes", data, true)
  return result
}

const removeOne = async (filter: { id: string }): Promise<true> => {
  await destroyOne("classes", filter)
  return true
}

const removeMany = async (items: { id: string }[]): Promise<true> => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("classes", filter)
  return true
}

const editOne = async (item: ClassesProperties): Promise<ClassesProperties> => {
  const filter = { id: item.id }
  const data = filterInput(item, classesStub)
  const result = await updateOne("classes", filter, data, true)
  return result
}

export default {
  list, select, create, removeOne, removeMany, editOne
}
