<style lang="stylus">
.el-date-editor--datetimerange.el-input,
.el-date-editor--datetimerange.el-input__inner,
.el-select
  width 100%
.el-range-editor .el-range-input
  width 50%
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
      <filter-form v-model="eventsUpcomingSearchFilter" @submit="setUpcomingEventsAsync" />

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

      <div v-loading="eventsFetchIsLoading">
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
          <el-table-column prop="date" label="Date" width="90px" sortable="custom"></el-table-column>
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
                  <el-dropdown-item :command="{ handler: 'edit', payload: scope.row }">
                    <i class="el-icon-edit el-icon--left"></i> Rediger
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ handler: 'remove', payload: scope.row }">
                    <i class="el-icon-delete el-icon--left"></i> Slett
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>

          <template slot="empty">
            Ingen prosjekter i visningen.
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

    <el-dialog
      title="Opprett et nytt stevne"
      custom-class="create-dialog"
      :visible.sync="eventsShowCreateDialog"
    >
      <div v-loading="eventsCreateIsLoading">
        <el-form
          ref="eventsCreateForm"
          label-position="top"
          :model="eventsCreateForm"
          :rules="eventsCreateFormRules"
        >
          <el-form-item label="Title" prop="title">
            <el-input placeholder="Enter a title" v-model="eventsCreateForm.title"></el-input>
          </el-form-item>

          <el-form-item label="Start / End" prop="date">
            <el-date-picker
              v-model="eventsCreateForm.date"
              type="datetimerange"
              range-separator="to"
              start-placeholder="Start date/time"
              end-placeholder="End date/time"
            ></el-date-picker>
          </el-form-item>

          <div class="flex">
            <el-form-item label="Category" prop="category" class="w-full mr-2">
              <el-select v-model="eventsCreateForm.category" placeholder="Select a category">
                <el-option
                  v-for="(category, index) in [ { _id: 0, title: 'Norgesmesterskap' } ]"
                  :key="category._id"
                  :label="category.title"
                  :value="category._id"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Branch" prop="branch"  class="w-full ml-2">
              <el-input placeholder="Enter a branch" v-model="eventsCreateForm.branch"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="Organizer" prop="organizer">
            <el-select v-model="eventsCreateForm.organizer" placeholder="Select the organizer">
              <el-option
                v-for="(club, index) in [ { _id: 0, title: 'Skedsmo Civile Skydeselskab' } ]"
                :key="club._id"
                :label="club.title"
                :value="club._id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="Area" prop="area">
            <el-input placeholder="Enter a area" v-model="eventsCreateForm.area"></el-input>
          </el-form-item>

          <el-form-item label="Approbated" prop="approbated">
            <el-switch
              v-model="eventsCreateForm.approbated"
              active-text="Is officially approbated?"
            ></el-switch>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
          <div class="flex justify-end">
            <el-button class="block" type="default" @click="eventsCreateFormSubmit">Cancel</el-button>
            <el-button class="block" type="primary" @click="eventsCreateFormSubmit">Lagre</el-button>
          </div>
        </span>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex"
import FilterForm from "@/components/FilterForm"

const eventsCreateFormStub = {
  title: "Skedsmo Championships",
  date: "",
  category: "Club",
  branch: "50m",
  organizer: "Skedsmo Civile Skydeselskab",
  area: "Korpåsen, Lillestrøm",
  approbated: "Y"
}

export default {
  name: "EventsScreen",

  components: { FilterForm },

  async created() {
    await this.setUpcomingEventsAsync()
  },

  data: () => ({
    activeTab: "upcoming",

    eventsShowCreateDialog: false,
    eventsCreateForm: eventsCreateFormStub,
    eventsCreateFormRules: {
    },

    eventsUpcomingPageSize: 15,
    eventsUpcomingPageCurrent: 1,
    eventsUpcomingSortBy: "title",
    eventsUpcomingSelection: []
  }),

  computed: {
    ...mapGetters({
      eventsUpcoming: "events/upcoming",
      eventsUpcomingCount: "events/upcomingCount",
      eventsFetchIsLoading: "events/fetchIsLoading",
      eventsCreateIsLoading: "events/createIsLoading"
    }),
    eventsUpcomingHasSelection() {
      return this.eventsUpcomingSelection.length > 0
    },
    eventsUpcomingSearchFilter: {
      get() { return this.$store.state.events.upcomingSearchFilter },
      set(search) { this.setUpcomingEventsSearchFilter(search) }
    }
  },

  methods: {
    ...mapMutations({
      setUpcomingEventsSearchFilter: "events/SET_UPCOMING_SEARCH_FILTER"
    }),
    ...mapActions({
      setUpcomingEventsAsync: "events/setUpcomingAsync",
      createEventAsync: "events/createEventAsync"
    }),

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    },
    async eventsCreateFormSubmit() {
      try {
        console.log(this.eventsCreateForm)
        // await this.createEventAsync(this.eventsCreateForm)
        this.$notify({
          title: "Great success",
          message: `${this.eventsCreateForm.title} was successfully added to the database`,
          type: "success"
        })
        this.eventsCreateForm = { ...eventsCreateFormStub }
        this.eventsShowCreateDialog = false
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    },

    eventsUpcomingTableDispatchActions() {
    },
    eventsUpcomingSelectionChange() {
    },
    eventsUpcomingRowClick() {
      this.$router.push("/events/view")
    },
    eventsUpcomingSetSorting() {
    },
    eventsUpcomingTableRowDispatchActions() {
    },

    eventsUpcomingSetPageSize() {
    },
    eventsUpcomingSetPageCurrent() {
    }
  }
}
</script>
