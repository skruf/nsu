import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany, updateMany
} from "@/db/queries"
import { filterInput } from "@/utils"
import { eventsDivisionsContestantsStub } from "@/stubs"

export const populate = async (doc) => {
  const member = await doc.populate("memberId")
  const division = await doc.populate("divisionId")
  const weaponClass = await findOne("classes", { id: doc.weapon.classId }, {}, true)

  const contestant = doc.toJSON()
  contestant.member = member.toJSON()
  contestant.division = division.toJSON()
  contestant.weapon.class = weaponClass

  return contestant
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("events_divisions_contestants", filter, options)
  result.items = await Promise.all(
    result.items.map(async (doc) => populate(doc))
  )
  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("events_divisions_contestants", filter, options)
  const contestant = await populate(doc)
  return contestant
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item, eventsDivisionsContestantsStub)
  const doc = await insert("events_divisions_contestants", data, options)
  const contestant = await populate(doc)
  return contestant
}

const createMany = async (items, options = {}) => {
  const data = filterInput(items, eventsDivisionsContestantsStub)
  const docs = await insertMany("events_divisions_contestants", data, options)
  const contestants = await Promise.all(
    docs.map((doc) => populate(doc))
  )

  console.log(contestants)

  return {
    items: contestants,
    count: contestants.length
  }
}

const editMany = async (items, options = {}) => {
  const data = filterInput(items, eventsDivisionsContestantsStub)
  const docs = await updateMany("events_divisions_contestants", data)
  const contestants = await Promise.all(docs.map((doc) => populate(doc)))

  return {
    items: contestants,
    count: contestants.length
  }
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_divisions_contestants", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions_contestants", filter, options)
  return true
}

export default {
  list, select, create, createMany, removeOne, removeMany, editMany
}
