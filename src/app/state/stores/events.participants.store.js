import { eventsParticipantsService } from "~/services"
import extend from "~/state/extensions"

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
      list: eventsParticipantsService.list,
      select: eventsParticipantsService.select,
      createOne: eventsParticipantsService.createOne,
      createMany: eventsParticipantsService.createMany,
      removeOne: eventsParticipantsService.removeOne,
      removeMany: eventsParticipantsService.removeMany,
      editOne: eventsParticipantsService.editOne
    }
  },
  {
    module: "pagination"
  },
  {
    module: "sorting"
  }
  // {
  //   module: "search",
  //   options: { fields: [ "firstName", "lastName" ] }
  // }
]

export default extend(store, modules)
