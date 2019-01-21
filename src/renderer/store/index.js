import Vue from "vue"
import Vuex from "vuex"

import events from "./modules/events"
import participants from "./modules/events/participants"
import divisions from "./modules/events/divisions"
import contestants from "./modules/events/divisions/contestants"
import clubs from "./modules/clubs"
import members from "./modules/clubs/members"
import ranges from "./modules/ranges"
import classes from "./modules/classes"

Vue.config.devtools = true
Vue.use(Vuex)

const modules = {}

modules.events = events
modules.events.modules = { participants, divisions }
modules.events.modules.divisions.modules = { contestants }
modules.clubs = clubs
modules.clubs.modules = { members }
modules.ranges = ranges
modules.classes = classes

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== "production",
  modules: modules
})

export default store
