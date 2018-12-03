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

      <!-- <el-tabs v-model="activeTab">
        <el-tab-pane label="Upcoming" name="upcoming"> -->

          <el-form ref="form" class="filter-form" @submit.prevent.native="eventsFetchMany">
            <el-input v-model="eventsSearchFilter" placeholder="Enter search words.." :clearable="true"></el-input>
            <el-button native-type="submit" type="primary">Search</el-button>
          </el-form>

          <div class="table-controls">
            <div class="table-controls-actions" :class="{ 'disabled': !eventsHasSelection }">
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

            <div class="table-controls-buttons">
              <el-button type="text" size="small" @click="eventsOpenCreateDialog">
                <i class="el-icon-plus el-icon--right"></i> Create new event
              </el-button>
            </div>
          </div>

          <el-table
            :data="eventsUpcoming"
            @selection-change="eventsSelectionChange"
            @row-click="eventsRowClick"
            @sort-change="eventsSetSorting"
            :sort-by="eventsSortBy"
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
                <!-- <el-dropdown @command="dispatchTableRowActions"> -->
                <el-dropdown>
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
              <nuxt-link to="/events/new">Create new?</nuxt-link>
            </template>
          </el-table>

          <el-pagination
            layout="total, sizes, prev, pager, next"
            @size-change="eventsSetPageSize"
            @current-change="eventsSetPageCurrent"
            :page-size="eventsPageSize"
            :current-page="eventsPageCurrent"
            :page-sizes="[ 15, 30, 45, 60 ]"
            :total="eventsCount"
          ></el-pagination>

        <!-- </el-tab-pane>

        <el-tab-pane label="History" name="history">
        </el-tab-pane>
      </el-tabs> -->

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "EventsScreen",
  data: () => ({
    activeTab: "upcoming",

    eventsUpcoming: [
      {
        _id: 0,
        title: "Skedsmo Championships",
        date: "10.12.19",
        category: "Club",
        branch: "50m",
        organizer: "Skedsmo Civile Skydeselskab",
        area: "Korpåsen, Lillestrøm",
        participants: "5",
        approbated: "Y"
      },
      {
        _id: 1,
        title: "NM skive 2018",
        date: "30.03.18",
        category: "NM",
        branch: "25M + 50M",
        organizer: "Norsksvartkruttunion",
        area: "Finnsnes, Troms",
        participants: "63",
        approbated: "N"
      },
      {
        _id: 2,
        title: "NM Langhold 2018",
        date: "14.11.18",
        category: "NM",
        branch: "100M",
        organizer: "Norsksvartkruttunion",
        area: "Tørrmoen, Brandval",
        participants: "194",
        approbated: "Y"
      }
    ],
    eventsSearchFilter: "",
    eventsCount: 3,
    eventsPageSize: 15,
    eventsPageCurrent: 1,
    eventsSortBy: "title",
    eventsSelection: []
  }),
  computed: {
    eventsHasSelection() {
      return this.eventsSelection.length > 0
    }
  },
  methods: {
    eventsDispatchTableActions() {
    },
    eventsTableDispatchActions() {
    },
    eventsOpenCreateDialog() {
    },
    eventsSelectionChange() {
    },
    eventsRowClick() {
      this.$router.push("/events/view")
    },
    eventsSetSorting() {
    },
    eventsFetchMany() {
    },
    eventsSetPageSize() {
    },
    eventsSetPageCurrent() {
    }
  }
}
</script>
