import classesService from "~/services/classes.service"
import extend from "~/state/extensions"
import { classesCategoriesFixture, classesConditionsFixture } from "~/fixtures"

const state = {
  categories: classesCategoriesFixture,
  conditions: classesConditionsFixture
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
      list: classesService.list,
      select: classesService.select,
      create: classesService.create,
      removeOne: classesService.removeOne,
      removeMany: classesService.removeMany,
      editOne: classesService.editOne
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
    options: { fields: [ "name" ] }
  }
]

export default extend(store, modules)
