import { rangesService } from "@/services"
import extend from "@/store/extensions"
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
      listAsync: rangesService.list,
      selectAsync: rangesService.select,
      createAsync: rangesService.create,
      removeAsync: rangesService.remove
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