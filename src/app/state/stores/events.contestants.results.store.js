import { eventsContestantsResultsService } from "~/services"
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
      list: eventsContestantsResultsService.list,
      createMany: eventsContestantsResultsService.createMany,
      removeOne: eventsContestantsResultsService.removeOne,
      removeMany: eventsContestantsResultsService.removeMany
    }
  }
]

export default extend(store, modules)
