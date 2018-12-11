import { insert, find, findOne, remove } from "@/db"

export const stub = {
  name: "",
  email: "",
  address: "",
  area: "",
  country: "",
  range: "",
  leader: ""
}

export const findClubsAsync = async (filter = {}, options = {}) => {
  const results = await find("clubs", filter, options)
  return results
}

export const findOneClubAsync = async (filter = {}, options = {}) => {
  const results = await findOne("clubs", filter, options)
  return results
}

export const insertClubAsync = async (doc = {}, options = {}) => {
  const results = await insert("clubs", doc, options)
  return results
}

export const removeClubAsync = async (filter = {}, options = {}) => {
  const results = await remove("clubs", filter, options)
  return results
}
