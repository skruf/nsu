import flushPromises from "flush-promises"
import { classesFixture } from "~/fixtures"
import { classesService } from "~/services"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const { classesFixture } = require("~/fixtures")
  const mockQueries = require("~/utils/tests/mockQueries").default
  return mockQueries(classesFixture)
})

describe("classes.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list classes", async () => {
    const filter = {}
    const options = {}

    const res = await classesService.list(filter, options)
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(classesFixture)
    expect(res.count).toEqual(classesFixture.length)
  })

  it("should select a classe", async () => {
    const filter = {}
    const options = {}

    const res = await classesService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(res).toEqual(classesFixture[0])
  })

  it("should create a classe", async () => {
    const filter = {}
    const options = {}

    const res = await classesService.create(filter, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(res).toEqual(classesFixture[0])
  })

  it("should remove a classe", async () => {
    const item = {}
    const options = {}

    const res = await classesService.removeOne(item, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many classes", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await classesService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
