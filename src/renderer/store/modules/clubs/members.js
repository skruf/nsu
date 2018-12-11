import {
  findClubMembersAsync,
  insertClubMemberAsync
} from "@/db/clubs/members"
import extend from "@/store/extensions"

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
      listAsync: findClubMembersAsync,
      createAsync: insertClubMemberAsync
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
