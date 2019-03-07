<style lang="stylus">
</style>

<template>
  <el-container
    id="events-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/events', label: 'Events' },
          { to: '', label: breadcrumbLabel }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ breadcrumbLabel }} events
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <events-list-table
        @eventsOpenCreateDialog="eventsOpenCreateDialog"
      />
    </el-main>

    <el-footer height="auto">
      <!-- <el-button
        type="primary"
        @click="navToCreate"
      >
        <i class="el-icon-plus el-icon--left" /> Create event
      </el-button> -->
      <el-button
        type="primary"
        @click="eventsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> Create event
      </el-button>
    </el-footer>

    <events-create-dialog
      :shown.sync="eventsShowCreateDialog"
    />
  </el-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import EventsListTable from "@/containers/events/EventsListTable"
import EventsCreateDialog from "@/containers/events/EventsCreateDialog"

export default {
  name: "EventsListScreen",

  components: {
    BreadcrumbBar,
    EventsListTable,
    EventsCreateDialog
  },

  data: () => ({
    eventsShowCreateDialog: false
  }),

  computed: {
    ...mapState("events", {
      eventsStateFetchMode: "fetchMode"
    }),

    breadcrumbLabel() {
      if(this.eventsStateFetchMode === "history") {
        return "Past"
      }
      return this.eventsStateFetchMode || "All"
    }
  },

  watch: {
    "$route.query.filter": {
      immediate: true,
      handler: async function(mode) {
        this.eventsMutationsSetFetchMode(mode)
        await this.eventsActionsList()
      }
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetFetchMode: "SET_FETCH_MODE"
    }),

    ...mapActions("events", {
      eventsActionsList: "list"
    }),

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    },

    navToCreate() {
      this.$router.push(`/events/create`)
    }
  }
}
</script>
