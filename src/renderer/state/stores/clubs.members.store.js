import { clubsMembersService } from "@/services"
import extend from "@/state/extensions"
import { countriesFixture } from "@/fixtures"

const state = {
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
      list: clubsMembersService.list,
      create: clubsMembersService.create,
      removeOne: clubsMembersService.removeOne,
      removeMany: clubsMembersService.removeMany,
      editOne: clubsMembersService.editOne
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
    options: { fields: [ "firstName", "lastName" ] }
  }
]

export default extend(store, modules)
