import { insertMany, findMany, destroyOne, destroyMany } from "~/db/queries"
import { filterInput } from "~/utils"
import { eventsContestantsResultsStub } from "~/stubs"

const populate = async (doc) => {
  const contestant = await doc.populate("contestantId")

  const result = doc.toJSON()
  result.contestant = contestant.toJSON()

  return result
}

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany(
    "events_contestants_results", filter, options
  )
  result.items = await Promise.all(
    result.items.map(async (doc) => populate(doc))
  )
  return result
}

const createMany = async (items, options = {}) => {
  const data = filterInput(items, eventsContestantsResultsStub)
  const docs = await insertMany(
    "events_contestants_results", data, options
  )
  const result = await Promise.all(
    docs.map(async (doc) => populate(doc))
  )
  return {
    items: result,
    count: result.length
  }
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_contestants_results", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_contestants_results", filter, options)
  return true
}

export default {
  list, createMany, removeOne, removeMany
}
