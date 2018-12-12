import { insert } from "@/db"
// import { insert, find, findOne, remove } from "@/db"
import { members } from "@/../../mocks"

export const stub = {
  eventId: "",
  memberId: ""
}

export const findEventParticipantsAsync = async (filter = {}, options = {}) => {
  // const results = await find("participants", filter, options)

  // const w = await Promise.all(results.participants.map((participant) => {
  //   return new Promise(async (resolve, reject) => {
  //     // participant.member = await findOne("members", { _id: participant.memberId })
  //     participant.member = members[0]
  //     resolve(participant)
  //   })
  // }))

  const a = members.map((participant) => {
    const member = participant.member
    delete participant._id
    delete participant.createdAt
    delete participant.updatedAt
    delete participant.member
    return {
      ...participant,
      ...member
    }
  })

  return { items: a, count: a.length }
}

export const insertEventParticipantsAsync = async (doc, options = {}) => {
  const results = await insert("participants", doc, options)
  return results
}
