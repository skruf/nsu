import {
  findClubsAsync,
  findOneClubAsync,
  insertClubAsync,
  removeClubAsync
} from "@/db/clubs/index"
import extend from "@/store/extensions"

const state = {}
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
      listAsync: findClubsAsync,
      selectAsync: findOneClubAsync,
      createAsync: insertClubAsync,
      removeAsync: removeClubAsync
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
