import {
  findEventsAsync,
  findOneEventAsync,
  insertEventAsync,
  removeEventAsync
} from "@/db/events/index"
import extend from "@/store/extensions"
import { queryHelper } from "@/utils"

const state = {}
const mutations = {}
const actions = {}
const getters = {}

state.fetchMode = ""

mutations.SET_FETCH_MODE = (state, fetchMode) => {
  state.fetchMode = fetchMode
}

actions.listAsync = async ({ commit, state }, filter = {}) => {
  commit("SET_LIST_LOADING", true)
  const config = queryHelper(state)
  const results = await findEventsAsync(filter, config, state.fetchMode)
  commit("SET_LIST", results.items)
  commit("SET_COUNT", results.count)
  commit("SET_LIST_LOADING", false)
}

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
      listAsync: findEventsAsync,
      selectAsync: findOneEventAsync,
      createAsync: insertEventAsync,
      removeAsync: removeEventAsync
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
    options: { fields: [ "title" ] }
  }
]

export default extend(store, modules)
