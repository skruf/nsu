import { insert, find, findOne, remove } from "@/db"

export const stub = {
  "number": "7 (MLAIC)",
  "name": "Colt",
  "category": "Pistols & Revolvers",
  "condition": "Original",
  "target": "ISSF 50 meters pistolskive",
  "position": "Stående",
  "distance": "25 meter",
  "type": "Fri orginal perkusjonsrevolver",
  "sight": "Tidsriktige. Fri høyde på forsiktet, men profilen må være i original stil",
  "trigger": "Original",
  "calibre": "Fritt",
  "bulletType": "Rund, avrundet",
  "loadingRod": "",
  "cleaning": "",
  "team": "Nr. 30 Adams",
  "remarks": "Tønnen skal lades med minst 5 skudd to ganger deretter 3 skudd. Ved lading skal tønnen være montert på revolveren",
  "pictureUrl": "https://norsksvartkruttunion.no/wp-content/uploads/2014/03/Colt.png"
}

export const findClassesAsync = async (filter = {}, options = {}) => {
  const results = await find("classes", filter, options)
  return results
}

export const findOneClassAsync = async (filter = {}, options = {}) => {
  const results = await findOne("classes", filter, options)
  return results
}

export const insertClassAsync = async (doc = {}, options = {}) => {
  const results = await insert("classes", doc, options)
  return results
}

export const removeClassAsync = async (filter, options = {}) => {
  const results = await remove("classes", filter, options)
  return results
}
