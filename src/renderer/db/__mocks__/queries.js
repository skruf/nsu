import { rangesFixture } from "@/fixtures"

const mocks = rangesFixture.map((fixture) => ({
  ...fixture,
  toJSON: jest.fn().mockReturnValue(fixture)
}))

export const findMany = jest.fn().mockResolvedValue({
  items: mocks, count: mocks.length
})
export const findOne = jest.fn().mockResolvedValue(mocks[0])
export const insert = jest.fn().mockResolvedValue(mocks[0])
export const destroyOne = jest.fn().mockResolvedValue(true)
export const destroyMany = jest.fn().mockResolvedValue(true)
