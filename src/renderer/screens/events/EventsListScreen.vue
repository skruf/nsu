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
      <search-form
        v-model="eventsSearchFilter"
        @submit="eventsSubmitSearchFilterAsync"
        placeholder="Search for an event by title or club"
      />

      <div class="table-actions" :class="{ 'disabled': !eventsHasSelection }">
        <el-dropdown @command="eventsTableDispatchActions">
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

      <div v-loading="eventsListIsLoading || eventsRemoveIsLoading">
        <el-table
          :data="eventsList"
          @selection-change="eventsSelectionChange"
          @row-click="eventsRowClick"
          @sort-change="eventsSetSortingAsync"
          :sort-by="eventsSortBy"
          row-key="_id"
          class="table-clickable"
          empty-text
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="startsAt" label="Starts" width="90px" sortable="custom" :sort-orders="eventsSortOrders">
            <template slot-scope="scope">
              <date-with-tooltip :date="scope.row.startsAt" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="Title" sortable="custom" :sort-orders="eventsSortOrders"></el-table-column>
          <el-table-column prop="organizer" label="Organizer" sortable="custom" :sort-orders="eventsSortOrders"></el-table-column>
          <el-table-column prop="category" label="Category" sortable="custom" :sort-orders="eventsSortOrders"></el-table-column>
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-dropdown trigger="click" @command="eventsTableRowDispatchActions">
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                    <i class="el-icon-edit el-icon--left"></i> Rediger
                  </el-dropdown-item> -->
                  <el-dropdown-item :command="{ handler: 'eventsDelete', payload: scope.row }">
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
          @size-change="eventsSetPageSizeAsync"
          @current-change="eventsSetPageCurrentAsync"
          :page-size="eventsPageSize"
          :current-page="eventsPageCurrent"
          :page-sizes="[ 15, 30, 45, 60 ]"
          :total="eventsCount"
        ></el-pagination>
      </div>

      <div class="page-actions">
        <el-button @click="eventsOpenCreateDialog" type="primary">
          <i class="el-icon-plus el-icon--right"></i> Create event
        </el-button>
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
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"
import EventsCreateDialog from "@/components/EventsCreateDialog"
import DateWithTooltip from "@/components/DateWithTooltip"

export default {
  name: "EventsListScreen",

  components: {
    SearchForm,
    EventsCreateDialog,
    DateWithTooltip
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
    eventsShowCreateDialog: false,
    eventsSelection: [],
    eventsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events", {
      eventsListIsLoading: "listIsLoading",
      eventsCreateIsLoading: "createIsLoading",
      eventsRemoveIsLoading: "removeIsLoading",
      eventsSortBy: "sortBy",
      eventsPageSize: "pageSize",
      eventsPageCurrent: "pageCurrent",
      eventsFetchMode: "fetchMode",
      eventsCount: "count",
      eventsList: "list"
    }),
    eventsHasSelection() {
      return this.eventsSelection.length > 0
    },
    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.eventsSetSearchFilter(search) }
    },
    eventsfetchModeIsUpcoming() {
      return this.eventsFetchMode === "upcoming"
    },
    eventsfetchModeIsHistory() {
      return this.eventsFetchMode === "history"
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsSetSearchFilter: "SET_SEARCH_FILTER",
      eventsSetFetchMode: "SET_FETCH_MODE"
    }),
    ...mapActions("events", {
      eventsListAsync: "listAsync",
      eventsCreateAsync: "createAsync",
      eventsRemoveAsync: "removeAsync",
      eventsSetSortingAsync: "setSortingAsync",
      eventsSetPageSizeAsync: "setPageSizeAsync",
      eventsSetPageCurrentAsync: "setPageCurrentAsync"
    }),

    async eventsSubmitSearchFilterAsync(search) {
      await this.eventsListAsync()
    },

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    },
    async eventsCreateFormSubmit(form) {
      try {
        await this.eventsCreateAsync(form)
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

    eventsTableRowDispatchActions({ handler, payload }) {
      switch(handler) {
        case "eventsDelete":
          this.eventsDeleteAsync(payload)
          break
      }
    },
    async eventsDeleteAsync(event) {
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
        await this.eventsRemoveAsync(event)
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

    eventsRowClick(event, e) {
      if(e.target.className.includes("table-button")) {
        return
      }
      this.$router.push(`/events/${event._id}`)
    },

    eventsTableDispatchActions({ handler, payload }) {
    },
    eventsSelectionChange(events) {
      this.eventsSelection = events
    }
  }
}
</script>
