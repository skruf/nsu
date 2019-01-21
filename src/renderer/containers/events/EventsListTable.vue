<style lang="stylus">
</style>

<template>
  <div class="events-list-table">
    <search-form
      v-model="eventsSearchFilter"
      placeholder="Search for an event by title or club"
      @submit="eventsSubmitSearchFilterAsync"
    />

    <div v-loading="eventsListIsLoading || eventsRemoveIsLoading">
      <el-table
        :data="eventsList"
        :sort-by="eventsSortBy"
        row-key="_id"
        class="table-clickable"
        empty-text
        @selection-change="eventsSelectionChange"
        @row-click="eventsRowClick"
        @sort-change="eventsSetSortingAsync"
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
          prop="category"
          label="Category/Branch"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.category }}
            </h6>
            <small class="small">
              {{ scope.row.branch }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="organizerName"
          label="Area/Organizer"
          sortable="custom"
          :sort-orders="eventsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.area }}
            </h6>
            <small class="small">
              {{ scope.row.organizerName }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !eventsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="eventsTableDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="removeSelection">
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="eventsTableRowDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                  <i class="el-icon-edit el-icon--left"></i> Rediger
                </el-dropdown-item> -->
                <el-dropdown-item :command="{ handler: 'eventsDelete', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left" /> Slett
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
        :page-size="eventsPageSize"
        :current-page="eventsPageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsCount"
        @size-change="eventsSetPageSizeAsync"
        @current-change="eventsSetPageCurrentAsync"
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
