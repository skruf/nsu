import uuid from "uuid/v1"

export default (doc) => {
  doc.id = uuid()
  return doc
}
