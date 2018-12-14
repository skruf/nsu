import { insert, find, findOne, remove } from "@/db"

export const stub = {
  firstName: "",
  lastName: "",
  emailAddress: "",
  country: "",
  phoneNumber: "",
  clubId: ""
}

export const findClubMembersAsync = async (filter = {}, options = {}) => {
  const members = await find("members", filter, options)

  const results = await Promise.all(members.items.map((member) => {
    return new Promise(async (resolve, reject) => {
      const club = await findOne("clubs", { _id: member.clubId })
      resolve({ ...member, clubName: club.name })
    })
  }))

  return { items: results, count: members.count }
}

export const findOneClubMemberAsync = async (filter = {}, options = {}) => {
  const member = await findOne("members", filter, options)
  const club = await findOne("clubs", { _id: member.clubId })
  return { ...member, clubName: club.name }
}

export const insertClubMemberAsync = async (doc = {}, options = {}) => {
  const results = await insert("members", doc, options)
  return results
}

export const removeClubMemberAsync = async (filter, options = {}) => {
  const results = await remove("members", filter, options)
  return results
}
