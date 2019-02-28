import { insert, find, findOne, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}) => {
  const results = await find("clubs", filter, options)

  results.items = await Promise.all(results.items.map(async (club) => {
    club = club.toJSON()
    const members = await find("clubs_members", { clubId: club.id })
    club.membersCount = members.count
    return club
  }))

  return results
}

const select = async (filter = {}, options = {}) => {
  const results = await findOne("clubs", filter, options)
  return results.toJSON()
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("clubs", doc, options)
  return results.toJSON()
}

const remove = async (filter, options = {}) => {
  await destroy("clubs", filter, options)
  return true
}

export default {
  list, select, create, remove
}
