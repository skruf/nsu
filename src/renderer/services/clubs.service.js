import {
  insert, findMany, findOne, destroyOne, destroyMany
} from "@/db/queries"

// if(result.rangeId) {
// let range = doc.populate("rangeId")
// club.range = range.toJSON()
// }

// let club = result.toJSON()
// club = await populate(club)

// if(result.rangeId) {
//   let range = result.populate("rangeId")
//   club.range = range.toJSON()
// }

// result.items = await Promise.all(result.items.map(async (club) => {
//   club = club.toJSON()
//   club = await populate(club)
//   return club
// }))

// await destroyMany("clubs_members", { clubId: club.id })

const populate = async (doc) => {
  const members = await findMany("clubs_members", { clubId: doc.id })

  const club = doc.toJSON()
  club.membersCount = members.count

  // console.log(club)

  // if(club.rangeId) {
  let range = await doc.populate("rangeId")
  club.range = range.toJSON() || null
  // }

  // console.log(club.range)

  return club
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

const create = async (data = {}, options = {}) => {
  const result = await insert("clubs", data, options)
  const club = result.toJSON()
  club.membersCount = 0
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

export default {
  list, select, create, removeOne, removeMany
}
