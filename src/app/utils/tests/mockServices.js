export default (fixture) => {
  const select = jest.fn().mockResolvedValue(fixture[0])
  const create = jest.fn().mockResolvedValue(fixture[0])
  const removeOne = jest.fn().mockResolvedValue(true)
  const removeMany = jest.fn().mockResolvedValue(true)
  const list = jest.fn().mockResolvedValue({
    items: fixture,
    count: fixture.length
  })
  const createMany = jest.fn().mockResolvedValue({
    items: fixture,
    count: fixture.length
  })

  return {
    list,
    select,
    create,
    createMany,
    removeOne,
    removeMany
  }
}
