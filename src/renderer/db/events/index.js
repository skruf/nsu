import { insert, find, findOne, remove } from "@/db"

export const stub = {
  title: "",
  startsAt: "",
  endsAt: "",
  category: "",
  branch: "",
  organizerId: "",
  area: "",
  approbated: "",
  lat: 0,
  lng: 0
}

export const findEventsAsync = async (filter = {}, options = {}, fetchMode) => {
  if(fetchMode === "upcoming") {
    filter.startsAt = { $gte: new Date() }
  }
  if(fetchMode === "history") {
    filter.startsAt = { $lte: new Date() }
  }

  const results = await find("events", filter, options)

  results.items = await Promise.all(results.items.map((event) => {
    return new Promise(async (resolve, reject) => {
      const club = await findOne("clubs", { _id: event.organizerId })
      if(club) {
        event.organizerName = club.name
      }
      resolve(event)
    })
  }))

  return results
}

export const findOneEventAsync = async (filter = {}, options = {}) => {
  const results = await findOne("events", filter, options)

  const club = await findOne("clubs", { _id: results.organizerId })
  if(club) {
    results.organizerName = club.name
  }

  return results
}

export const insertEventAsync = async (doc = {}, options = {}) => {
  const results = await insert("events", doc, options)
  return results
}

export const removeEventAsync = async (filter, options = {}) => {
  const event = await findOneEventAsync(filter)

  if(!event) {
    throw new Error("Couldnt find event")
  }

  const participants = await find("participants", { eventId: event._id })

  await Promise.all(participants.items.map((participant) => {
    return new Promise(async (resolve, reject) => {
      await remove("participants", { _id: participant._id })
      resolve()
    })
  }))

  const results = await remove("events", filter, options)
  return results
}
