import flushPromises from "flush-promises"
import { clubsMembersFixture } from "@/fixtures"
import { clubsMembersService } from "@/services"
import {
  findMany, insert, destroyOne, destroyMany
} from "@/db/queries"

jest.mock("@/db/queries", () => {
  const { clubsMembersFixture, clubsFixture } = require("@/fixtures")
  const mockQueries = require("@/utils/tests/mockQueries").default
  return mockQueries(clubsMembersFixture, {
    clubId: { data: clubsFixture[0] }
  })
})

describe("clubs.members.service", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("should list club members", async () => {
    const filter = {}
    const options = {}

    const res = await clubsMembersService.list(filter, options)
    const member = res.items[0]
    await flushPromises()

    expect(findMany).toHaveBeenCalled()
    expect(res.items).toEqual(clubsMembersFixture)
    expect(res.count).toEqual(clubsMembersFixture.length)
    expect(member).toEqual(clubsMembersFixture[0])
  })

  it("should create a club member", async () => {
    const data = {}
    const options = {}

    const member = await clubsMembersService.create(data, options)
    await flushPromises()

    expect(insert).toHaveBeenCalled()
    expect(member).toEqual(clubsMembersFixture[0])
  })

  it("should remove a club member", async () => {
    const filter = {}
    const options = {}

    const res = await clubsMembersService.removeOne(filter, options)
    await flushPromises()

    expect(destroyOne).toHaveBeenCalled()
    expect(res).toEqual(true)
  })

  it("should remove many club members", async () => {
    const items = [{ id: 0 }]
    const options = {}

    const res = await clubsMembersService.removeMany(items, options)
    await flushPromises()

    expect(destroyMany).toHaveBeenCalled()
    expect(res).toEqual(true)
  })
})
