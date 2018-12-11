import { insert, find, findOne, remove } from "@/db"

export const stub = {
  name: "",
  emailAddress: "",
  country: "",
  phoneNumber: "",
  clubId: ""
}

export const findClubMembersAsync = async (filter = {}, options = {}) => {
  const results = await find("members", filter, options)
  return results
}

export const findOneClubMemberAsync = async (filter = {}, options = {}) => {
  const results = await findOne("members", filter, options)
  return results
}

export const insertClubMemberAsync = async (doc = {}, options = {}) => {
  const results = await insert("members", doc, options)
  return results
}

export const removeClubMemberAsync = async (filter = {}, options = {}) => {
  const results = await remove("members", filter, options)
  return results
}
