import { insert, find, findOne, destroy } from "@/db/queries"

const list = async (filter = {}, options = {}, fetchMode) => {
  if(fetchMode === "upcoming") {
    filter.startsAt = { $gte: new Date() }
  }
  if(fetchMode === "history") {
    filter.startsAt = { $lte: new Date() }
  }

  const results = await find("events", filter, options)

  results.items = await Promise.all(results.items.map((event) => {
    return new Promise(async (resolve) => {
      const club = await findOne("clubs", { _id: event.organizerId })
      if(club) {
        event.organizerName = club.name
      }
      event.range = await findOne("ranges", { _id: event.rangeId }) || {}
      resolve(event)
    })
  }))

  return results
}

const select = async (filter = {}, options = {}) => {
  const results = await findOne("events", filter, options)
  const club = await findOne("clubs", { _id: results.organizerId })
  if(club) {
    results.organizerName = club.name
  }
  const range = await findOne("ranges", { _id: results.rangeId })
  if(range) {
    results.range = range
  }
  return results
}

const create = async (doc = {}, options = {}) => {
  const results = await insert("events", doc, options)
  return results
}

const remove = async (filter, options = {}) => {
  const event = await select(filter)

  if(!event) {
    throw new Error("Couldnt find event")
  }

  const participants = await find("participants", { eventId: event._id })

  await Promise.all(participants.items.map((participant) => {
    return new Promise(async (resolve) => {
      await destroy("participants", { _id: participant._id })
      resolve()
    })
  }))

  const results = await destroy("events", filter, options)
  return results
}

export default {
  list, select, create, remove
}
