import { insert, findMany, findOne, destroyOne, destroyMany } from "@/db/queries"

const withMembersCount = async (club) => {
  const members = await findMany("clubs_members", { clubId: club.id })
  club.membersCount = members.count
  return club
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("clubs", filter, options)
  result.items = await Promise.all(result.items.map(async (club) => {
    club = club.toJSON()
    club = await withMembersCount(club)
    return club
  }))
  return result
}

const select = async (filter = {}, options = {}) => {
  const result = await findOne("clubs", filter, options)
  let club = result.toJSON()
  club = await withMembersCount(club)
  // if(result.rangeId) {
  //   let range = result.populate("rangeId")
  //   club.range = range.toJSON()
  // }
  return club
}

const create = async (doc = {}, options = {}) => {
  const result = await insert("clubs", doc, options)
  const club = result.toJSON()
  club.membersCount = 0
  return club
}

const removeOne = async (club, options = {}) => {
  await destroyMany("clubs_members", { clubId: club.id })
  await destroyOne("clubs", { id: club.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("clubs", filter, options)
  return true
}

export default {
  list, select, create, removeOne, removeMany
}
