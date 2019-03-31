import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany
} from "@/db/queries"
import { eventsDivisionsContestantsStub } from "@/stubs"

const populate = async (doc) => {
  const member = await doc.populate("memberId")
  const division = await doc.populate("divisionId")
  const classItem = await doc.populate("classId")

  const contestant = doc.toJSON()

  contestant.member = member.toJSON()
  contestant.division = division.toJSON()
  contestant.class = classItem.toJSON()

  return contestant
}

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(eventsDivisionsContestantsStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}, fetchMode) => {
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
  const data = filterInput(item)
  const doc = await insert("events_divisions_contestants", data, options)
  const contestant = await populate(doc)
  return contestant
}

const createMany = async (items, options = {}) => {
  const data = items.map((i) => filterInput(i))
  const docs = await insertMany("events_divisions_contestants", data, options)

  const contestants = await Promise.all(
    docs.map((doc) => populate(doc))
  )

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
  list, select, create, createMany, removeOne, removeMany
}
