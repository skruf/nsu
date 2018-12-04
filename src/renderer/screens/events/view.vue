<style lang="stylus">
.event-grid
  display flex
  flex-wrap wrap
  margin-top -10px
  margin-bottom 10px
  margin-left -30px
  margin-right -30px
  padding 0px 15px 10px
  border-bottom 1px solid var(--border-color)
.event-grid-item
  width 33.3333%
  padding 10px 15px
  display flex
.event-grid-item-key
  width 90px
.event-grid-item-value
  margin-left 10px

</style>

<template>
  <el-container class="screen" id="events-screen">
    <el-header height="auto">
      <div class="page-titles">
        <h1 class="text-4xl">{{ event.title }}</h1>
        <h2 class="text-lg font-thin mt-2">Approbated</h2>
      </div>

      <div class="page-controls">
        <!-- <el-dropdown @command="eventsTableDispatchActions"> -->
        <el-dropdown trigger="click">
          <el-button type="text">
            <div class="flex items-center">
              Actions <i class="ml-3 text-2xl el-icon-arrow-down el-icon-setting el-icon--left"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="removeSelection">
              <i class="el-icon-printer el-icon--left"></i> Print
            </el-dropdown-item>
            <el-dropdown-item command="removeSelection">
              <i class="el-icon-edit el-icon--left"></i> Edit
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-menu-delete" command="removeSelection" divided>
              <i class="el-icon-delete el-icon--left"></i> Delete
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/events' }">Events</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/events/view` }">{{ event.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="event-grid">
        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Organizer:</h3>
          <p class="event-grid-item-value">{{ event.organizer }}</p>
        </div>
        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Area:</h3>
          <p class="event-grid-item-value">{{ event.area }}</p>
        </div>

        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Starts at:</h3>
          <p class="event-grid-item-value">{{ event.startsAt }}</p>
        </div>
        <div class="event-grid-item">
          <h3 class="event-grid-item-key">End at:</h3>
          <p class="event-grid-item-value">{{ event.endsAt }}</p>
        </div>

        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Category:</h3>
          <p class="event-grid-item-value">{{ event.category }}</p>
        </div>
        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Branch:</h3>
          <p class="event-grid-item-value">{{ event.branch }}</p>
        </div>

        <div class="event-grid-item">
          <h3 class="event-grid-item-key">Lat/Lng:</h3>
          <p class="event-grid-item-value">{{ event.lat }} {{ event.lng }}</p>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="Participants" name="participants">
          <el-form ref="form" class="filter-form" @submit.prevent.native="participantsFetchMany">
            <el-input v-model="participantsSarchFilter" placeholder="Enter search words.." :clearable="true"></el-input>
            <el-button native-type="submit" type="primary">Search</el-button>
          </el-form>

          <div class="table-controls">
            <div class="table-controls-actions" :class="{ 'disabled': !participantsHasSelection }">
              <el-dropdown trigger="click" @command="participantsTableDispatchActions">
                <el-button type="text" size="small">
                  Actions <i class="el-icon-arrow-down el-icon--left"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="removeSelection">
                    <i class="el-icon-delete el-icon--left"></i> Remove participants
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>

            <div class="table-controls-buttons">
              <el-button type="text" size="small" @click="participantsOpenCreateDialog">
                <i class="el-icon-plus el-icon--right"></i> Create / Add participant(s)
              </el-button>
            </div>
          </div>

          <el-table
            :data="participants"
            @selection-change="participantsSelectionChange"
            @row-click="participantsRowClick"
            @sort-change="participantsSetSorting"
            :sort-by="participantsSortBy"
            row-key="_id"
            class="table-clickable"
            empty-text
          >
            <el-table-column type="selection" width="30"></el-table-column>
            <el-table-column prop="name" label="Name" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.firstName }} {{ scope.row.lastName }}
              </template>
            </el-table-column>
            <el-table-column prop="club" label="Club" sortable="custom"></el-table-column>
            <el-table-column prop="emailAddress" label="Email" sortable="custom"></el-table-column>
            <el-table-column prop="country" label="Country" width="120px" sortable="custom"></el-table-column>
            <el-table-column prop="phoneNumber" label="Phone" width="110px" sortable="custom"></el-table-column>
            <el-table-column width="40">
              <template slot-scope="scope">
                <el-dropdown trigger="click" @command="participantsTableRowDispatchActions">
                  <span class="el-dropdown-link">
                    <i class="el-icon-setting"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="{ handler: 'remove', payload: scope.row }">
                      <i class="el-icon-delete el-icon--left"></i> Remove participant
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <template slot="empty">
              No participants yet.
              <nuxt-link to="/events/new">Create/add one?</nuxt-link>
            </template>
          </el-table>

          <el-pagination
            layout="total, sizes, prev, pager, next"
            @size-change="participantsSetPageSize"
            @current-change="participantsSetPageCurrent"
            :page-size="participantsPageSize"
            :current-page="participantsPageCurrent"
            :page-sizes="[ 15, 30, 45, 60 ]"
            :total="participantsCount"
          ></el-pagination>
        </el-tab-pane>

        <el-tab-pane label="Results" name="results">
        </el-tab-pane>
      </el-tabs>

    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "EventsViewScreen",
  data: () => ({
    activeTab: "participants",

    event: {
      _id: 0,
      title: "NM Langhold 2018",
      organizer: "Norsksvartkruttunion",
      area: "Tørrmoen, Brandval",
      startsAt: "14.11.18",
      endsAt: "16.11.18",
      lat: "59.917561",
      lng: "10.754604",
      category: "NM",
      branch: "100M",
      approbated: "Y"
    },

    participants: [
      {
        _id: 0,
        firstName: "Ola",
        lastName: "Dunk",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "ola@dunk.no",
        country: "Norway",
        phoneNumber: "4044404"
      },
      {
        _id: 1,
        firstName: "Per",
        lastName: "Arne",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "per@arne.no",
        country: "Norway",
        phoneNumber: "9045423"
      },
      {
        _id: 2,
        firstName: "Ingar",
        lastName: "Hagen",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "ingar@hagen.no",
        country: "Sweden",
        phoneNumber: "3234814"
      },
      {
        _id: 3,
        firstName: "Ola",
        lastName: "Dunk",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "ola@dunk.no",
        country: "Norway",
        phoneNumber: "4044404"
      },
      {
        _id: 4,
        firstName: "Per",
        lastName: "Arne",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "per@arne.no",
        country: "Norway",
        phoneNumber: "9045423"
      },
      {
        _id: 5,
        firstName: "Ingar",
        lastName: "Hagen",
        club: "Skedsmo Civile Skydeselskab",
        emailAddress: "ingar@hagen.no",
        country: "Sweden",
        phoneNumber: "3234814"
      }
    ],
    participantsSarchFilter: "",
    participantsPageSize: 15,
    participantsPageCurrent: 1,
    participantsSortBy: "_id",
    participantsSelection: [],
    participantsCount: 6
  }),
  computed: {
    participantsHasSelection() {
      return this.participantsSelection.length > 0
    }
  },
  methods: {
    participantsDispatchTableActions() {
    },
    participantsTableDispatchActions() {
    },
    participantsOpenCreateDialog() {
    },
    participantsSelectionChange(participants) {
      this.participantsSelection = participants
    },
    participantsRowClick() {
    },
    participantsSetSorting() {
    },
    participantsFetchMany() {
    },
    participantsSetPageSize() {
    },
    participantsSetPageCurrent() {
    },
    participantsTableRowDispatchActions() {
    }
  }
}
</script>
