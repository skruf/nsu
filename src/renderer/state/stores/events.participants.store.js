import { eventsParticipantsService } from "@/services"
import extend from "@/state/extensions"

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
      listAsync: eventsParticipantsService.list,
      createAsync: eventsParticipantsService.create,
      removeAsync: eventsParticipantsService.remove
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
