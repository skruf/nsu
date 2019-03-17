import extend from "@/state/extensions"
import { rangesService } from "@/services"
import { countriesFixture } from "@/fixtures"

export const state = {
  countries: countriesFixture
}
const mutations = {}
const actions = {}
const getters = {}

const store = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

const modules = [
  {
    module: "crud",
    options: {
      list: rangesService.list,
      select: rangesService.select,
      create: rangesService.create,
      removeOne: rangesService.removeOne,
      removeMany: rangesService.removeMany
    }
  },
  {
    module: "pagination"
  },
  {
    module: "sorting"
  },
  {
    module: "search",
    options: { fields: [ "name", "area" ] }
  }
]

export default extend(store, modules)
