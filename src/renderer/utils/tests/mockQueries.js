export default (fixture, populate) => {
  const withToJSON = (data) => ({
    ...data, toJSON: jest.fn().mockReturnValue(data)
  })

  const mockPopulate = jest.fn().mockImplementation(
    (ref) => withToJSON(populate[ref].data)
  )

  const withPopulate = (data) => ({
    ...data,
    // populate: mockPopulate

    populate: jest.fn().mockImplementation(
      (ref) => {
        let population = populate[ref]
        let data = population.data

        if(Array.isArray(data)) {
          data = data.map((d) => withToJSON(d))
        } else {
          data = withToJSON(data)
        }

        if(population.populate) {
          data.populate = jest.fn().mockImplementation(
            (subRef) => {
              let data = population.populate[subRef].data

              if(Array.isArray(data)) {
                data = data.map((d) => withToJSON(d))
              } else {
                data = withToJSON(data)
              }

              return data
            }
          )
        }

        return data
      }
    )

  })

  const mocks = fixture.map((mock) => {
    mock = withToJSON(mock)
    if(populate) mock = withPopulate(mock)
    return mock
  })

  const findOne = jest.fn().mockResolvedValue(mocks[0])
  const insert = jest.fn().mockResolvedValue(mocks[0])
  const destroyOne = jest.fn().mockResolvedValue(true)
  const destroyMany = jest.fn().mockResolvedValue(true)
  const findMany = jest.fn().mockResolvedValue({
    items: mocks,
    count: mocks.length
  })

  return {
    findMany,
    findOne,
    insert,
    destroyOne,
    destroyMany
  }
}
