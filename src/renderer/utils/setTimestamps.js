export default (doc) => {
  const date = new Date()
  doc.createdAt = date.toISOString()
  doc.updatedAt = date.toISOString()
  return doc
}
