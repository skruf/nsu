import { rangesFixture } from "@/fixtures"

export default {
  namespaced: true,
  state: {
    searchFilterValue: "",
    list: rangesFixture
  },
  mutations: {
    SET_SEARCH_FILTER: jest.fn()
  },
  actions: {
    list: jest.fn().mockResolvedValue(rangesFixture)
  }
}
