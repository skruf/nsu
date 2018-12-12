<style lang="stylus">
</style>

<template>
  <div class="events-list-table">
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
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"
import DateWithTooltip from "@/components/DateWithTooltip"

export default {
  name: "EventsListTable",

  components: {
    SearchForm,
    DateWithTooltip
  },

  data: () => ({
    eventsSelection: [],
    eventsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events", {
      eventsListIsLoading: "listIsLoading",
      eventsRemoveIsLoading: "removeIsLoading",
      eventsSortBy: "sortBy",
      eventsPageSize: "pageSize",
      eventsPageCurrent: "pageCurrent",
      eventsCount: "count",
      eventsList: "list"
    }),
    eventsHasSelection() {
      return this.eventsSelection.length > 0
    },
    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.eventsSetSearchFilter(search) }
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("events", {
      eventsListAsync: "listAsync",
      eventsRemoveAsync: "removeAsync",
      eventsSetSortingAsync: "setSortingAsync",
      eventsSetPageSizeAsync: "setPageSizeAsync",
      eventsSetPageCurrentAsync: "setPageCurrentAsync"
    }),

    eventsOpenCreateDialog() {
      this.$emit("eventsOpenCreateDialog")
    },

    async eventsSubmitSearchFilterAsync(search) {
      await this.eventsListAsync()
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
