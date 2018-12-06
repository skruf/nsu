<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="events-screen">
    <el-header height="auto">
      <h1 class="text-4xl">
        <template v-if="fetchModeIsUpcoming">Upcoming</template>
        <template v-else-if="fetchModeIsHistory">Past</template>
        <template v-else>All</template>
        events
      </h1>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/events' }">Events</el-breadcrumb-item>
        <el-breadcrumb-item>
          <template v-if="fetchModeIsUpcoming">Upcoming</template>
          <template v-else-if="fetchModeIsHistory">History</template>
          <template v-else>All</template>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <filter-form
        v-model="eventsSearchFilter"
        @submit="submitListEventsSearchFilterAsync"
        placeholder="Search for an event by title or club"
      />

      <div class="table-controls">
        <div class="table-controls-actions" :class="{ 'disabled': !eventsUpcomingHasSelection }">
          <el-dropdown @command="eventsUpcomingTableDispatchActions">
            <el-button type="text" size="small">
              Actions <i class="el-icon-arrow-down el-icon--left"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="removeSelection">
                <i class="el-icon-delete el-icon--left"></i> Slett valgte
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <div class="table-controls-buttons">
          <el-button type="text" size="small" @click="eventsOpenCreateDialog">
            <i class="el-icon-plus el-icon--right"></i> Create new event
          </el-button>
        </div>
      </div>

      <div v-loading="eventsListIsLoading || eventsRemoveIsLoading">
        <!-- :default-sort="defaultSort" -->
        <el-table
          :data="eventsUpcoming"
          @selection-change="eventsUpcomingSelectionChange"
          @row-click="eventsUpcomingRowClick"
          @sort-change="setEventsUpcomingSorting"
          :sort-by="eventsUpcomingSortBy"
          row-key="_id"
          class="table-clickable"
          empty-text
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="startsAt" label="Starts" width="90px" sortable="custom" :sort-orders="sortOrders">
            <template slot-scope="scope">
              <date-with-tooltip :date="scope.row.startsAt" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="Title" sortable="custom" :sort-orders="sortOrders"></el-table-column>
          <el-table-column prop="organizer" label="Organizer" sortable="custom" :sort-orders="sortOrders"></el-table-column>
          <el-table-column prop="area" label="Area" sortable="custom" :sort-orders="sortOrders"></el-table-column>
          <el-table-column prop="category" label="Category" width="120px" sortable="custom" :sort-orders="sortOrders"></el-table-column>
          <el-table-column prop="branch" label="Branch" width="110px" sortable="custom" :sort-orders="sortOrders"></el-table-column>
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-dropdown trigger="click" @command="eventsUpcomingTableRowDispatchActions">
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                    <i class="el-icon-edit el-icon--left"></i> Rediger
                  </el-dropdown-item> -->
                  <el-dropdown-item :command="{ handler: 'removeEvent', payload: scope.row }">
                    <i class="el-icon-delete el-icon--left"></i> Slett
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <template slot="empty">
            No events yet.
            <el-button type="text" size="small" @click="eventsOpenCreateDialog">
              Create new?
            </el-button>
          </template>
        </el-table>

        <el-pagination
          layout="total, sizes, prev, pager, next"
          @size-change="setEventsUpcomingPageSize"
          @current-change="setEventsUpcomingPageCurrent"
          :page-size="eventsUpcomingPageSize"
          :current-page="eventsUpcomingPageCurrent"
          :page-sizes="[ 15, 30, 45, 60 ]"
          :total="eventsUpcomingCount"
        ></el-pagination>
      </div>
    </el-main>

    <events-create-dialog
      ref="eventsCreateDialog"
      :shown.sync="eventsShowCreateDialog"
      @submit="eventsCreateFormSubmit"
      :isLoading="eventsCreateIsLoading"
    />
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import FilterForm from "@/components/FilterForm"
import EventsCreateDialog from "@/components/EventsCreateDialog"
import DateWithTooltip from "@/components/DateWithTooltip"

export default {
  name: "ListEventsScreen",

  components: {
    FilterForm,
    EventsCreateDialog,
    DateWithTooltip
  },

  watch: {
    "$route.query.filter": {
      immediate: true,
      handler: async function(mode) {
        this.setEventsFetchMode(mode)
        await this.listEventsAsync()
      }
    }
  },

  data: () => ({
    mode: "all",
    eventsShowCreateDialog: false,
    eventsUpcomingSelection: [],
    defaultSort: { prop: "startsAt", order: "descending" },
    sortOrders: [ "ascending", "descending" ]
  }),

  computed: {
    ...mapGetters({
      eventsUpcoming: "events/upcoming",
      eventsUpcomingCount: "events/upcomingCount",
      eventsListIsLoading: "events/listIsLoading",
      eventsCreateIsLoading: "events/createIsLoading",
      eventsRemoveIsLoading: "events/removeIsLoading",

      eventsUpcomingSortBy: "events/sortBy",
      eventsUpcomingPageSize: "events/pageSize",
      eventsUpcomingPageCurrent: "events/pageCurrent",

      eventsFetchMode: "events/fetchMode"
    }),
    eventsUpcomingHasSelection() {
      return this.eventsUpcomingSelection.length > 0
    },
    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.setEventsSearchFilter(search) }
    },
    fetchModeIsUpcoming() {
      return this.eventsFetchMode === "upcoming"
    },
    fetchModeIsHistory() {
      return this.eventsFetchMode === "history"
    }
  },

  methods: {
    ...mapMutations({
      setEventsSearchFilter: "events/SET_SEARCH_FILTER",
      setEventsFetchMode: "events/SET_FETCH_MODE"
    }),
    ...mapActions({
      listEventsAsync: "events/listAsync",
      createEventAsync: "events/createAsync",
      removeEventAsync: "events/removeAsync",
      setEventsUpcomingSorting: "events/setSorting",
      setEventsUpcomingPageSize: "events/setPageSize",
      setEventsUpcomingPageCurrent: "events/setPageCurrent"
    }),

    async submitListEventsSearchFilterAsync(search) {
      await this.listEventsAsync()
    },

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    },
    async eventsCreateFormSubmit(form) {
      try {
        await this.createEventAsync(form)
        this.$notify({
          title: "Great success",
          message: `${form.title} was successfully added to the database`,
          type: "success"
        })
        this.$refs.eventsCreateDialog.clear()
        this.eventsShowCreateDialog = false
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    },

    eventsUpcomingTableRowDispatchActions({ handler, payload }) {
      switch(handler) {
        case "removeEvent":
          this.eventsRemoveAsync(payload)
          break
      }
    },
    async eventsRemoveAsync(event) {
      await this.$confirm(
        `This will remove ${event.title} permanently. Continue?`,
        "Warning!", {
          confirmButtonText: "Yes, I am sure",
          cancelButtonText: "Cancel",
          customClass: "dangerous-confirmation",
          type: "warning"
        }
      )
      try {
        await this.removeEventAsync(event)
        this.$notify({
          title: "Success",
          message: `${event.title} was removed from the database`,
          type: "success"
        })
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    },

    eventsUpcomingRowClick(event, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/events/${event._id}`)
    },

    eventsUpcomingTableDispatchActions({ handler, payload }) {
    },
    eventsUpcomingSelectionChange(events) {
      this.eventsUpcomingSelection = events
    }
  }
}
</script>
