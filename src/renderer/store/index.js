import Vue from "vue"
import Vuex from "vuex"

import events from "./modules/events"
import participants from "./modules/events/participants"
import divisions from "./modules/events/divisions"

import clubs from "./modules/clubs"
import members from "./modules/clubs/members"

Vue.use(Vuex)

const files = require.context("./modules", false, /\.js$/)
const modules = {}

files.keys().forEach((key) => {
  if(key === "./index.js") return
  modules[key.replace(/(\.\/|\.js)/g, "")] = files(key).default
})

modules.events = events
modules.events.modules = { participants, divisions }
modules.clubs = clubs
modules.clubs.modules = { members }

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: modules
})

export default store
