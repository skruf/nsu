import { clubsService } from "@/services"
import extend from "@/state/extensions"
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
      listAsync: clubsService.list,
      selectAsync: clubsService.select,
      createAsync: clubsService.create,
      removeAsync: clubsService.remove
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
    options: { fields: [ "name" ] }
  }
]

export default extend(store, modules)
