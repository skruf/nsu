import {
  insert, insertMany, findMany, findOne, destroyOne, destroyMany, updateMany
} from "~/db/queries"
import { eventsParticipantsWeaponsStub } from "~/stubs"
import { filterInput } from "~/utils"

const populate = async (doc) => {
  const weaponClass = await doc.populate("classId")
  const participant = await doc.populate("participantId")

  const weapon = doc.toJSON()
  weapon.class = weaponClass.toJSON()
  weapon.participant = participant.toJSON()

  return weapon
}

const list = async (filter = {}, options = {}) => {
  const result = await findMany("events_participants_weapons", filter, options)
  result.items = await Promise.all(
    result.items.map((doc) => populate(doc))
  )
  return result
}

const select = async (filter = {}, options = {}) => {
  const doc = await findOne("events_participants_weapons", filter, options)
  const weapon = await populate(doc)
  return weapon
}

const createOne = async (item = {}, options = {}) => {
  const data = filterInput(item, eventsParticipantsWeaponsStub)
  const doc = await insert("events_participants_weapons", data, options)
  const weapon = await populate(doc)
  return weapon
}

const createMany = async (items = {}, options = {}) => {
  const data = items.map((item) => filterInput(item, eventsParticipantsWeaponsStub))
  const docs = await insertMany("events_participants_weapons", data, options)
  const weapons = await Promise.all(
    docs.map((doc) => populate(doc))
  )
  return weapons
}

const removeOne = async (weapon, options = {}) => {
  await destroyOne("events_participants_weapons", { id: weapon.id }, options)
  return true
}

const removeMany = async (items, options = {}) => {
  const filter = {
    id: { $in: items.map(({ id }) => id) }
  }
  await destroyMany("events_participants_weapons", filter, options)
  return true
}

const editMany = async (items) => {
  const data = filterInput(items, eventsParticipantsWeaponsStub)
  const docs = await updateMany("events_participants_weapons", data)
  const weapons = await Promise.all(docs.map((doc) => populate(doc)))
  return weapons
}

export default {
  list, createMany, select, createOne, removeOne, removeMany, editMany
}
