import {
  insert, findMany, destroyOne, destroyMany, updateOne,
  QueryOptions, QueryFilter, QueryResult
} from "~/db/queries"
import { clubsMembersStub } from "~/stubs"
import { filterInput } from "~/utils"
import { ClubsMembersProperties } from "~/db/collections/clubs.members.collection"

const list = async (filter: QueryFilter, options: QueryOptions): Promise<{
  items: QueryResult[], count: number
}> => {
  const result = await findMany("clubs_members", filter, options, true)
  return result
}

const create = async (item: ClubsMembersProperties): Promise<ClubsMembersProperties> => {
  const data = filterInput(item, clubsMembersStub)
  const result = await insert("clubs_members", data, true)
  return result
}

const removeOne = async (clubMember: { id: string }): Promise<true> => {
  await destroyOne("clubs_members", { id: clubMember.id })
  return true
}

const removeMany = async (items: { id: string }[]) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs_members", filter)
  return true
}

const editOne = async (item: ClubsMembersProperties): Promise<ClubsMembersProperties> => {
  const filter = { id: item.id }
  const data = filterInput(item, clubsMembersStub)
  const result = await updateOne("clubs_members", filter, data, true)
  return result
}

export default {
  list, create, removeOne, removeMany, editOne
}
