import {
  findEventParticipantsAsync,
  insertEventParticipantsAsync,
  removeEventParticipantAsync
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
      createAsync: insertEventParticipantsAsync,
      removeAsync: removeEventParticipantAsync
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
