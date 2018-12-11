import { insert, find, findOne, remove } from "@/db"

export const stub = {
  title: "",
  startsAt: "",
  endsAt: "",
  category: "",
  branch: "",
  organizer: "",
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
  return results
}

export const findOneEventAsync = async (filter = {}, options = {}) => {
  const results = await findOne("events", filter, options)
  return results
}

export const insertEventAsync = async (doc = {}, options = {}) => {
  const results = await insert("events", doc, options)
  return results
}

export const removeEventAsync = async (filter = {}, options = {}) => {
  const results = await remove("events", filter, options)
  return results
}
