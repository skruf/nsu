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
      list: eventsDivisionsContestantsService.list,
      select: eventsDivisionsContestantsService.select,
      create: eventsDivisionsContestantsService.create,
      createMany: eventsDivisionsContestantsService.createMany,
      removeOne: eventsDivisionsContestantsService.removeOne,
      removeMany: eventsDivisionsContestantsService.removeMany,
      editMany: eventsDivisionsContestantsService.editMany
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
