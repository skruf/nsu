import {
  findEventParticipantsAsync,
  insertEventParticipantsAsync
} from "@/db/events/participants"
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
      listAsync: findEventParticipantsAsync,
      createAsync: insertEventParticipantsAsync
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
