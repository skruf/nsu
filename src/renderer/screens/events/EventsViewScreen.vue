<style lang="stylus">
</style>

<template>
  <el-container
    id="events-view-screen"
    v-loading="eventsSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/events', label: 'Events' },
          { to: `/events/${eventsSelected._id}`, label: eventsSelected.title }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ eventsSelected.title }}
          </h1>
          <small class="small">
            <template v-if="eventsSelected.approbated">
              <i class="el-icon-star-on" /> Officially approbated,
            </template>
            <template v-else>
              <i class="el-icon-star-off" /> Isn't approbated,
            </template>
            {{ eventsSelected.organizerName }}, {{ eventsSelected.area }}
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="eventsSelectedDispatchActions"
          >
            <el-button type="text">
              <div class="flex items-center">
                <i class="ml-3 text-xl el-icon-arrow-down el-icon-more el-icon--left" />
              </div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="eventsSelectedPrint">
                <i class="el-icon-printer el-icon--left" /> Print
              </el-dropdown-item>
              <el-dropdown-item command="eventsSelectedUpdate">
                <i class="el-icon-edit el-icon--left" /> Edit
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-menu-delete"
                command="eventsSelectedRemove"
                divided
              >
                <i class="el-icon-delete el-icon--left" /> Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <div class="info-grid">
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Starts at:
          </h6>
          <p class="info-grid_item_value">
            <date-with-tooltip :date="eventsSelected.startsAt" />
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            End at:
          </h6>
          <p class="info-grid_item_value">
            <date-with-tooltip :date="eventsSelected.endsAt" />
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Duration:
          </h6>
          <p class="info-grid_item_value">
            {{ eventsSelectedDuration }}
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Category:
          </h6>
          <p class="info-grid_item_value">
            {{ eventsSelected.category }}
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Branch:
          </h6>
          <p class="info-grid_item_value">
            {{ eventsSelected.branch }}
          </p>
        </div>
        <div
          v-if="eventsSelected.lat && eventsSelected.lng"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Lat/Lng:
          </h6>
          <p class="info-grid_item_value">
            {{ eventsSelected.lat }} {{ eventsSelected.lng }}
          </p>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="Participants"
          name="participants"
        >
          <div class="content">
            <events-participants-list-table
              v-if="!eventsSelectedIsLoading"
              :event="eventsSelected"
              @eventsParticipantsOpenManageDialog="eventsParticipantsOpenManageDialog"
            />
          </div>

          <el-footer height="auto">
            <el-button
              type="text"
              @click="clubsMembersOpenCreateDialog"
            >
              <i class="el-icon-plus el-icon--left" /> Create club member
            </el-button>
            <el-button
              type="primary"
              @click="eventsParticipantsOpenManageDialog"
            >
              <i class="ion-ios-keypad el-icon--left" /> Manage participants
            </el-button>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          label="Divisions"
          name="divisions"
        >
          <div class="content">
            <events-divisions-list
              v-if="!eventsSelectedIsLoading"
              :event="eventsSelected"
            />
          </div>

          <el-footer height="auto">
            <el-button
              type="primary"
              @click="eventsDivisionsOpenCreateDialog"
            >
              <i class="ion-ios-keypad el-icon--left" /> Create division
            </el-button>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          label="Results"
          name="results"
        >
          <div class="content">
            <events-results />
          </div>

          <el-footer height="auto">
            <el-button
              type="primary"
              @click="eventsParticipantsOpenManageDialog"
            >
              <i class="ion-ios-keypad el-icon--left" /> Input results
            </el-button>
            <el-button
              type="text"
              @click="clubsMembersOpenCreateDialog"
            >
              <i class="el-icon-plus el-icon--left" /> Create club member
            </el-button>
          </el-footer>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
    />

    <events-divisions-create-dialog
      v-if="!eventsSelectedIsLoading"
      :event="eventsSelected"
      :shown.sync="eventsDivisionsShowCreateDialog"
    />

    <events-participants-manager-dialog
      v-if="!eventsSelectedIsLoading"
      :event="eventsSelected"
      :shown.sync="eventsParticipantsShowManageDialog"
    />
  </el-container>
</template>

<script>
import moment from "moment"
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import DateWithTooltip from "@/components/DateWithTooltip"

import EventsParticipantsListTable from "@/containers/events/participants/EventsParticipantsListTable"
import EventsParticipantsManagerDialog from "@/containers/events/participants/EventsParticipantsManagerDialog"
import ClubsMembersCreateDialog from "@/containers/clubs/members/ClubsMembersCreateDialog"
import EventsDivisionsList from "@/containers/events/divisions/EventsDivisionsList"
import EventsDivisionsCreateDialog from "@/containers/events/divisions/EventsDivisionsCreateDialog"

import EventsResults from "@/components/EventsResults"

export default {
  name: "EventsViewScreen",

  components: {
    BreadcrumbBar,
    DateWithTooltip,
    EventsParticipantsListTable,
    EventsParticipantsManagerDialog,
    ClubsMembersCreateDialog,
    EventsDivisionsList,
    EventsDivisionsCreateDialog,

    EventsResults
  },

  data: () => ({
    activeTab: "participants",
    eventsParticipantsShowManageDialog: false,
    eventsDivisionsShowCreateDialog: false,
    clubsMembersShowCreateDialog: false
  }),

  computed: {
    ...mapState("events", {
      eventsSelectedIsLoading: "selectedIsLoading",
      eventsSelected: "selected"
    }),
    ...mapState("events/participants", {
      eventsParticipantsCreateIsLoading: "createIsLoading"
    }),
    eventsSelectedDuration() {
      if(!Object.keys(this.eventsSelected).length) {
        return
      }
      const { startsAt, endsAt } = this.eventsSelected
      return moment.duration(moment(endsAt).diff(startsAt)).humanize()
    }
  },

  async created() {
    await this.eventsSelectAsync({ _id: this.$route.params.eventId })
  },

  methods: {
    ...mapActions("events", {
      eventsSelectAsync: "selectAsync"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsCreateFormSubmit: "createAsync"
    }),

    eventsSelectedDispatchActions() {},

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    },

    eventsParticipantsOpenManageDialog() {
      this.eventsParticipantsShowManageDialog = true
    },

    eventsDivisionsOpenCreateDialog() {
      this.eventsDivisionsShowCreateDialog = true
    }
  }
}
</script>
