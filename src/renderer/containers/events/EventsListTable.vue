<style lang="stylus">
</style>

<template>
  <div class="events-list-table">
    <search-form
      v-model="eventsSearchFilter"
      placeholder="Search for an event by title or club"
      @submit="eventsActionsSetSearchFilter"
    />

    <div v-loading="eventsIsLoading">
      <el-table
        :data="eventsStateList"
        :sort-by="eventsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="eventsSelectionChange"
        @row-click="eventsRowClick"
        @sort-change="eventsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="startsAt"
          label="Starts/Ends"
          width="150px"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.startsAt | moment("MMM, D") }}
            </h6>
            <small class="small">
              {{ scope.row.endsAt | moment("MMM, D") }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="title"
          label="Title/Approbated"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.title }}
            </h6>
            <small class="small">
              <template v-if="scope.row.approbated">
                <i class="el-icon-star-on" /> Is approbated
              </template>
              <template v-else>
                <i class="el-icon-star-off" /> Isn't approbated
              </template>
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="rangeId"
          label="Range/Organizer"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.range.name }}
            </h6>
            <small class="small">
              {{ scope.row.club.name }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="category"
          label="Category"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        />

        <el-table-column
          width="50"
          align="right"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <div
              class="table-actions"
              :class="{ 'disabled': !eventsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="dispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="dispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'eventsOpenEditDialog',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> Edit event
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'eventsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> Remove event
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No events yet.
          <el-button
            type="text"
            @click="eventsOpenCreateDialog"
          >
            Create new?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="eventsStatePageSize"
        :current-page="eventsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsStateCount"
        @size-change="eventsActionsSetPageSize"
        @current-change="eventsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "EventsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    eventsSelection: [],
    eventsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events", {
      eventsStateListIsLoading: "listIsLoading",
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateRemoveManyIsLoading: "removeManyIsLoading",
      eventsStateSortBy: "sortBy",
      eventsStatePageSize: "pageSize",
      eventsStatePageCurrent: "pageCurrent",
      eventsStateCount: "count",
      eventsStateList: "list"
    }),

    eventsHasSelection() {
      return this.eventsSelection.length > 0
    },

    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilterValue },
      set(search) { this.eventsMutationsSetSearchFilter(search) }
    },

    eventsIsLoading() {
      return (
        this.eventsStateListIsLoading ||
        this.eventsStateRemoveOneIsLoading ||
        this.eventsStateRemoveManyIsLoading
      )
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("events", {
      eventsActionsList: "list",
      eventsActionsRemoveOne: "removeOne",
      eventsActionsRemoveMany: "removeMany",
      eventsActionsSetSorting: "setSorting",
      eventsActionsSetPageSize: "setPageSize",
      eventsActionsSetPageCurrent: "setPageCurrent",
      eventsActionsSetSearchFilter: "setSearchFilter"
    }),

    eventsOpenCreateDialog() {
      this.$emit("eventsOpenCreateDialog")
    },

    eventsOpenEditDialog(event) {
      this.$emit("eventsOpenEditDialog", event)
    },

    eventsRowClick(event, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.$router.push(`/events/${event.id}`)
      }
    },

    eventsSelectionChange(events) {
      this.eventsSelection = events
    },

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async eventsRemoveOne(event) {
      try {
        await this.$confirm(
          `This will remove ${event.title} permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsActionsRemoveOne(event)
        this.$notify({
          title: "Success",
          message: `${event.title} was removed from the database`,
          type: "success"
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    async eventsRemoveMany() {
      const count = this.eventsSelection.length
      try {
        await this.$confirm(
          `This will remove ${count} events permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsActionsRemoveMany(this.eventsSelection)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${count} events were removed from the database`
        })
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
}
</script>
