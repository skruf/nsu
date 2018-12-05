<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="events-screen">
    <el-header height="auto">
      <h1 class="text-4xl">Upcoming events</h1>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/events' }">Events</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/events' }">Upcoming</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <filter-form v-model="eventsSearchFilter" @submit="listEventsAsync" />

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
        <el-table
          :data="eventsUpcoming"
          @selection-change="eventsUpcomingSelectionChange"
          @row-click="eventsUpcomingRowClick"
          @sort-change="eventsUpcomingSetSorting"
          :sort-by="eventsUpcomingSortBy"
          row-key="_id"
          class="table-clickable"
          empty-text
        >
          <el-table-column type="selection" width="30"></el-table-column>
          <el-table-column prop="startsAt" label="Starts" width="90px" sortable="custom">
            <template slot-scope="scope">
              <date-with-tooltip :date="scope.row.startsAt" />
            </template>
          </el-table-column>
          <el-table-column prop="title" label="Title" sortable="custom"></el-table-column>
          <el-table-column prop="organizer" label="Organizer" sortable="custom"></el-table-column>
          <el-table-column prop="area" label="Area" sortable="custom"></el-table-column>
          <el-table-column prop="category" label="Category" width="120px" sortable="custom"></el-table-column>
          <el-table-column prop="branch" label="Branch" width="110px" sortable="custom"></el-table-column>
          <el-table-column width="40">
            <template slot-scope="scope">
              <el-dropdown trigger="click" @command="eventsUpcomingTableRowDispatchActions">
                <span class="el-dropdown-link">
                  <i class="el-icon-setting"></i>
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
          @size-change="eventsUpcomingSetPageSize"
          @current-change="eventsUpcomingSetPageCurrent"
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

  async created() {
    // this.$route.query.filter
    await this.listEventsAsync()
  },

  data: () => ({
    mode: "all",
    eventsShowCreateDialog: false,
    eventsUpcomingPageSize: 15,
    eventsUpcomingPageCurrent: 1,
    eventsUpcomingSortBy: "title",
    eventsUpcomingSelection: []
  }),

  computed: {
    ...mapGetters({
      eventsUpcoming: "events/upcoming",
      eventsUpcomingCount: "events/upcomingCount",
      eventsListIsLoading: "events/listIsLoading",
      eventsCreateIsLoading: "events/createIsLoading",
      eventsRemoveIsLoading: "events/removeIsLoading"
    }),
    eventsUpcomingHasSelection() {
      return this.eventsUpcomingSelection.length > 0
    },
    eventsSearchFilter: {
      get() { return this.$store.state.events.searchFilter },
      set(search) { this.setEventsSearchFilter(search) }
    }
  },

  methods: {
    ...mapMutations({
      setEventsSearchFilter: "events/SET_SEARCH_FILTER"
    }),
    ...mapActions({
      listEventsAsync: "events/listAsync",
      createEventAsync: "events/createAsync",
      removeEventAsync: "events/removeAsync"
    }),

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
      if(e.target.className.includes("cell")) {
        this.$router.push(`/events/${event._id}`)
      }
    },

    eventsUpcomingTableDispatchActions({ handler, payload }) {},
    eventsUpcomingSelectionChange() {},

    eventsUpcomingSetSorting() {
    },

    eventsUpcomingSetPageSize() {
    },
    eventsUpcomingSetPageCurrent() {
    }
  }
}
</script>
