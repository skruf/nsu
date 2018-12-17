import {
  findClassesAsync,
  findOneClassAsync,
  insertClassAsync,
  removeClassAsync
} from "@/db/classes"
import extend from "@/store/extensions"

const state = {
  categories: [
    "Rifles & Muskets",
    "Pistols & Revolvers",
    "Shotguns"
  ],
  conditions: [
    "Original",
    "Replica",
    "Original or Replica"
  ]
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
      listAsync: findClassesAsync,
      selectAsync: findOneClassAsync,
      createAsync: insertClassAsync,
      removeAsync: removeClassAsync
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
