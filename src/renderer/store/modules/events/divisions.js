import {
  findEventDivisionsAsync,
  findOneEventDivisionAsync,
  insertEventDivisionAsync,
  removeEventDivisionAsync
} from "@/db/events/divisions"
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
      listAsync: findEventDivisionsAsync,
      selectAsync: findOneEventDivisionAsync,
      createAsync: insertEventDivisionAsync,
      removeAsync: removeEventDivisionAsync
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
