import { eventsDivisionsContestantsResultsService } from "~/services"
import extend from "~/state/extensions"

const state = {
  sortBy: "-total"
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
      list: eventsDivisionsContestantsResultsService.list,
      createMany: eventsDivisionsContestantsResultsService.createMany,
      removeOne: eventsDivisionsContestantsResultsService.removeOne,
      removeMany: eventsDivisionsContestantsResultsService.removeMany
    }
  }
]

export default extend(store, modules)
