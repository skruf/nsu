import { eventsContestantsService } from "~/services"
import extend from "~/state/extensions"

const state = {
  sortBy: "stand"
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
      list: eventsContestantsService.list,
      select: eventsContestantsService.select,
      create: eventsContestantsService.create,
      createMany: eventsContestantsService.createMany,
      removeOne: eventsContestantsService.removeOne,
      removeMany: eventsContestantsService.removeMany,
      editMany: eventsContestantsService.editMany
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
