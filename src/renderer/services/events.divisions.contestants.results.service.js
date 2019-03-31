import { insertMany, findMany, destroyOne, destroyMany } from "@/db/queries"
import { eventsDivisionsContestantsResultsStub } from "@/stubs"

const filterInput = (item) => {
  const data = {}
  for(let key in item) {
    if(eventsDivisionsContestantsResultsStub.hasOwnProperty(key)) {
      data[key] = item[key]
    }
  }
  return data
}

const list = async (filter = {}, options = {}, fetchMode) => {
  const result = await findMany(
    "events_divisions_contestants_results", filter, options, true
  )
  return result
}

const createMany = async (items, options = {}) => {
  const data = items.map((i) => filterInput(i))
  const result = await insertMany(
    "events_divisions_contestants_results", data, options, true
  )
  return result
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_divisions_contestants_results", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_divisions_contestants_results", filter, options)
  return true
}

export default {
  list, createMany, removeOne, removeMany
}
