import flushPromises from "flush-promises"
import { clubsFixture, rangesFixture } from "~/fixtures"
import { clubsService } from "~/services"
import {
  findMany, findOne, insert, destroyOne, destroyMany
} from "~/db/queries"

jest.mock("~/db/queries", () => {
  const { clubsFixture, rangesFixture } = require("~/fixtures")
  const mockQueries = require("~/utils/tests/mockQueries").default
  return mockQueries(clubsFixture, {
    rangeId: { data: rangesFixture[0] }
  })
})

describe("clubs.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list clubs", async () => {
    const filter = {}
    const options = {}

    const res = await clubsService.list(filter, options)
    const club = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(clubsFixture)
    expect(res.count).toEqual(clubsFixture.length)
    expect(club).toEqual(clubsFixture[0])
    expect(club.range).toEqual(rangesFixture[0])
  })

  it("should select a club", async () => {
    const filter = {}
    const options = {}

    const club = await clubsService.select(filter, options)
    await flushPromises()

    expect(findOne).toHaveBeenCalled()
    expect(club).toEqual(clubsFixture[0])
    expect(club.range).toEqual(rangesFixture[0])
  })

  it("should create a club", async () => {
    const data = {}
    const options = {}

    const res = await clubsService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(res).toEqual(clubsFixture[0])
  })

  it("should remove a club", async () => {
    const filter = {}
    const options = {}

    const res = await clubsService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many ranges", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await clubsService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
