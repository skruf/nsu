import { insert, findMany, findOne, destroyOne, destroyMany } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  if(fetchMode === "upcoming") {
    filter.startsAt = { $gte: new Date() }
  }
  if(fetchMode === "history") {
    filter.startsAt = { $lte: new Date() }
  }

  const result = await findMany("events", filter, options)

  result.items = await Promise.all(result.items.map((event) => {
    event = event.toJSON()

    return new Promise(async (resolve) => {
      let club = await findOne("clubs", { id: event.organizerId })
      if(club) {
        club = club.toJSON()
        event.organizerName = club.name
      }

      let range = await findOne("ranges", { id: event.rangeId })
      if(range) {
        range = range.toJSON()
        event.range = range
      }

      resolve(event)
    })
  }))

  return result
}

const select = async (filter = {}, options = {}) => {
  const event = await findOne("events", filter, options)

  let club = await findOne("clubs", { id: event.organizerId })
  if(club) {
    club = club.toJSON()
    event.organizerName = club.name
  }

  let range = await findOne("ranges", { id: event.rangeId })
  if(range) {
    range = range.toJSON()
    event.range = range
  }

  return event
}

const create = async (doc = {}, options = {}) => {
  const event = await insert("events", doc, options)
  return event.toJSON()
}

const removeOne = async (filter, options = {}) => {
  const event = await select(filter)

  if(!event) {
    throw new Error("Couldnt find event")
  }

  const participants = await findMany("participants", { eventId: event.id })

  await Promise.all(participants.items.map((participant) => {
    return new Promise(async (resolve) => {
      await destroyOne("participants", { id: participant.id })
      resolve()
    })
  }))

  const result = await destroyOne("events", filter, options)
  return result
}

const removeMany = () => {
  destroyMany()
}

export default {
  list, select, create, removeOne, removeMany
}
