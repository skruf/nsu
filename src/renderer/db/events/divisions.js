import { insert, find, findOne, remove } from "@/db"

export const stub = {
  eventId: "",
  name: "",
  startsAt: "",
  endsAt: "",
  day: "",
  interval: "",
  contestants: []
}

// @TODO: handle search
export const findEventDivisionsAsync = async (filter = {}, options = {}) => {
  const results = await find("divisions", filter, options)

  results.contestants = await Promise.all(results.items.map((division) => {
    return new Promise(async (resolve, reject) => {
      const contestants = await Promise.all(division.contestants.map((contestant) => {
        return new Promise(async (resolve, reject) => {
          contestant.member = await findOne("members", { _id: contestant.memberId })
          contestant.class = await findOne("classes", { _id: contestant.classId })
          resolve(contestant)
        })
      }))
      resolve(contestants)
    })
  }))

  return results
}

export const findOneEventDivisionAsync = async (filter = {}, options = {}) => {
  const results = await findOne("divisions", filter, options)
  return results
}

export const insertEventDivisionAsync = async (doc, options = {}) => {
  // @TODO: check if already exists
  const results = await insert("divisions", doc, options)
  return results
}

export const removeEventDivisionAsync = async (filter, options = {}) => {
  const results = await remove("divisions", filter, options)
  return results
}
