import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany, updateMany
} from "~/db/queries"
import { filterInput } from "~/utils"
import { eventsContestantsStub } from "~/stubs"

export const populate = async (doc) => {
  const division = await doc.populate("divisionId")
  const participant = await doc.populate("participantId")
  const member = await participant.populate("memberId")
  const weapon = await doc.populate("weaponId")
  const weaponClass = await weapon.populate("classId")

  const contestant = doc.toJSON()
  contestant.division = division.toJSON()
  contestant.participant = participant.toJSON()
  contestant.participant.member = member.toJSON()
  contestant.weapon = weapon.toJSON()
  contestant.weapon.class = weaponClass.toJSON()

  return contestant
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("events_contestants", filter, options)
  result.items = await Promise.all(
    result.items.map(async (doc) => populate(doc))
  )
  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("events_contestants", filter, options)
  const contestant = await populate(doc)
  return contestant
}

const create = async (item = {}, options = {}) => {
  const data = filterInput(item, eventsContestantsStub)
  const doc = await insert("events_contestants", data, options)
  const contestant = await populate(doc)
  return contestant
}

const createMany = async (items, options = {}) => {
  const data = filterInput(items, eventsContestantsStub)
  const docs = await insertMany("events_contestants", data, options)
  const contestants = await Promise.all(
    docs.map((doc) => populate(doc))
  )

  return {
    items: contestants,
    count: contestants.length
  }
}

const editMany = async (items, options = {}) => {
  const data = filterInput(items, eventsContestantsStub)
  const docs = await updateMany("events_contestants", data)
  const contestants = await Promise.all(docs.map((doc) => populate(doc)))
  return contestants
}

const removeOne = async (filter, options = {}) => {
  await destroyOne("events_contestants", filter, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_contestants", filter, options)
  return true
}

export default {
  list, select, create, createMany, removeOne, removeMany, editMany
}
