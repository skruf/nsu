import { rangesFixture } from "@/fixtures"

const mocks = rangesFixture.map((fixture) => ({
  ...fixture,
  toJSON: jest.fn().mockReturnValue(fixture)
}))

export const find = jest.fn().mockResolvedValue({
  items: mocks, count: mocks.length
})
export const findOne = jest.fn().mockResolvedValue(mocks[0])
export const insert = jest.fn().mockResolvedValue(mocks[0])
export const destroy = jest.fn().mockResolvedValue(true)
