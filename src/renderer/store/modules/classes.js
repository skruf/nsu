import { classesService } from "@/services"
import extend from "@/store/extensions"
import { classesCategoriesFixture, classesConditionsFixture } from "@/fixtures"

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
      listAsync: classesService.list,
      selectAsync: classesService.select,
      createAsync: classesService.create,
      removeAsync: classesService.remove
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
