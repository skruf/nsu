import { insert, find, findOne, remove } from "@/db"

export const stub = {
  eventId: "",
  memberId: ""
}

// @TODO: handle search
export const findEventParticipantsAsync = async (filter = {}, options = {}) => {
  const results = await find("participants", filter)

  results.items = await Promise.all(results.items.map((participant) => {
    return new Promise(async (resolve, reject) => {
      const member = await findOne("members", { _id: participant.memberId })
      const club = await findOne("clubs", { _id: member.clubId })
      member.clubName = club.name
      participant.member = member
      resolve(participant)
    })
  }))

  return results
}

export const insertEventParticipantsAsync = async (doc, options = {}) => {
  // @TODO: check if already exists
  const results = await insert("participants", doc, options)
  return results
}

export const removeEventParticipantAsync = async (filter, options = {}) => {
  const results = await remove("participants", filter, options)
  return results
}

// export const removeEventParticipantAsync = async (filter, options = {}) => {
//   const member = await findOne("members", { _id: filter.memberId }, options)
//   await remove("participants", { memberId: member._id, eventId: filter.eventId }, options)
//   return member
// }
