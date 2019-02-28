import { eventsDivisionsContestantsService } from "@/services"
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
      listAsync: eventsDivisionsContestantsService.list,
      selectAsync: eventsDivisionsContestantsService.select,
      createAsync: eventsDivisionsContestantsService.create,
      removeAsync: eventsDivisionsContestantsService.remove
    }
  },
  {
    module: "pagination"
  },
  {
    module: "sorting"
  }
]

export default extend(store, modules)
