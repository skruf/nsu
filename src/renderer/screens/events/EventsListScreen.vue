<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="events-list-screen">
    <el-header height="auto">
      <h1 class="h1 text-4xl">
        <template v-if="eventsfetchModeIsUpcoming">Upcoming</template>
        <template v-else-if="eventsfetchModeIsHistory">Past</template>
        <template v-else>All</template>
        events
      </h1>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/events' }">Events</el-breadcrumb-item>
        <el-breadcrumb-item>
          <template v-if="eventsfetchModeIsUpcoming">Upcoming</template>
          <template v-else-if="eventsfetchModeIsHistory">History</template>
          <template v-else>All</template>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <events-list-table
        @eventsOpenCreateDialog="eventsOpenCreateDialog"
      />

      <div class="page-actions">
        <el-button @click="eventsOpenCreateDialog" type="primary">
          <i class="el-icon-plus el-icon--right"></i> Create event
        </el-button>
      </div>
    </el-main>

    <events-create-dialog
      :shown.sync="eventsShowCreateDialog"
    />
  </el-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import EventsListTable from "@/containers/events/EventsListTable"
import EventsCreateDialog from "@/containers/events/EventsCreateDialog"

export default {
  name: "EventsListScreen",

  components: {
    EventsListTable,
    EventsCreateDialog
  },

  watch: {
    "$route.query.filter": {
      immediate: true,
      handler: async function(mode) {
        this.eventsSetFetchMode(mode)
        await this.eventsListAsync()
      }
    }
  },

  data: () => ({
    eventsShowCreateDialog: false
  }),

  computed: {
    ...mapState("events", {
      eventsFetchMode: "fetchMode"
    }),
    eventsfetchModeIsUpcoming() {
      return this.eventsFetchMode === "upcoming"
    },
    eventsfetchModeIsHistory() {
      return this.eventsFetchMode === "history"
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsSetFetchMode: "SET_FETCH_MODE"
    }),

    ...mapActions("events", {
      eventsListAsync: "listAsync"
    }),

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    }
  }
}
</script>
