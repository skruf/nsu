export default (doc) => {
  const date = new Date()
  doc.createdAt = date
  doc.updatedAt = date
  return doc
}
