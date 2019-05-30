export default (fixture, populate, withMethods = false) => {
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
          if(Array.isArray(data)) {
            data = data.map((d) => ({
              ...d,
              populate: jest.fn().mockImplementation(
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
            }))
          } else {
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
        }

        return data
      }
    )
  })

  const mocks = fixture.map((mock) => {
    if(withMethods) {
      mock = withToJSON(mock)
      mock = withPopulate(mock)
    }
    return mock
  })

  const findOne = jest.fn().mockResolvedValue(mocks[0])
  const insert = jest.fn().mockResolvedValue(mocks[0])
  const insertMany = jest.fn().mockResolvedValue(mocks)
  const destroyOne = jest.fn().mockResolvedValue(true)
  const destroyMany = jest.fn().mockResolvedValue(true)
  const findMany = jest.fn().mockResolvedValue({
    items: mocks,
    count: mocks.length
  })
  const updateOne = jest.fn().mockResolvedValue(mocks[0])
  const updateMany = jest.fn().mockResolvedValue(mocks)

  return {
    findMany,
    findOne,
    insert,
    insertMany,
    destroyOne,
    destroyMany,
    updateOne,
    updateMany
  }
}
