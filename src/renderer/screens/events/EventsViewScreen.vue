<style lang="stylus">
</style>

<template>
  <el-container
    id="events-view-screen"
    v-loading="eventsStateSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/events', label: 'Events' },
          { to: `/events/${eventsStateSelected.id}`, label: eventsStateSelected.title }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ eventsStateSelected.title }}
          </h1>
          <small class="small">
            <template v-if="eventsStateSelected.approbated">
              <i class="el-icon-star-on" /> Officially approbated,
            </template>
            <template v-else>
              <i class="el-icon-star-off" /> Isn't approbated,
            </template>
            <template v-if="eventsStateSelected.range">
              {{ eventsStateSelected.range.name }},
            </template>
            <template v-if="eventsStateSelected.club">
              {{ eventsStateSelected.club.name }}
            </template>
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="dispatchActions"
          >
            <el-button type="text">
              <i class="el-icon-arrow-down el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{
                  handler: 'eventsOpenPrintDialog'
                }"
              >
                <i class="el-icon-printer el-icon--left" /> Print event
              </el-dropdown-item>

              <el-dropdown-item
                :command="{
                  handler: 'eventsOpenEditDialog'
                }"
              >
                <i class="el-icon-edit el-icon--left" /> Edit event
              </el-dropdown-item>

              <el-dropdown-item
                divided
                class="dropdown-menu-delete"
                :command="{
                  handler: 'eventsRemoveOne'
                }"
              >
                <i class="el-icon-delete el-icon--left" /> Remove event
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
          <p
            v-if="eventsStateSelected.startsAt"
            class="info-grid_item_value"
          >
            <date-with-tooltip :date="eventsStateSelected.startsAt" />
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            End at:
          </h6>
          <p
            v-if="eventsStateSelected.endsAt"
            class="info-grid_item_value"
          >
            <date-with-tooltip :date="eventsStateSelected.endsAt" />
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
            {{ eventsStateSelected.category }}
          </p>
        </div>
        <div
          v-if="eventsStateSelected.lat && eventsStateSelected.lng"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Lat/Lng:
          </h6>
          <p class="info-grid_item_value">
            {{ eventsStateSelected.lat }} {{ eventsStateSelected.lng }}
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
              v-if="!eventsStateSelectedIsLoading"
              :event="eventsStateSelected"
              @eventsParticipantsOpenManageDialog="eventsParticipantsOpenManageDialog"
              @eventsParticipantsOpenEditDialog="eventsParticipantsOpenEditDialog"
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
              v-if="!eventsStateSelectedIsLoading"
              :event="eventsStateSelected"
              @eventsDivisionsOpenCreateDialog="eventsDivisionsOpenCreateDialog"
            />
          </div>

          <el-footer height="auto">
            <el-button
              type="primary"
              @click="eventsDivisionsOpenCreateDialog"
            >
              <i class="el-icon-plus el-icon--left" /> Create division
            </el-button>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          label="Results"
          name="results"
        >
          <div class="content">
            <events-divisions-contestants-results-list
              v-if="!eventsStateSelectedIsLoading"
              :event="eventsStateSelected"
            />
          </div>

          <el-footer height="auto">
            <el-button
              disabled
              type="primary"
              @click="eventsDivisionsContestantsResultsOpenCreateDialog"
            >
              <i class="el-icon-plus el-icon--left" /> Input results
            </el-button>
          </el-footer>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
    />

    <events-divisions-create-dialog
      v-if="!eventsStateSelectedIsLoading"
      :shown.sync="eventsDivisionsShowCreateDialog"
      :event="eventsStateSelected"
    />

    <events-participants-manager-dialog
      v-if="!eventsStateSelectedIsLoading"
      :shown.sync="eventsParticipantsShowManageDialog"
      :event="eventsStateSelected"
    />

    <events-divisions-contestants-results-create-dialog
      :shown.sync="eventsDivisionsContestantsResultsShowCreateDialog"
      :event="eventsStateSelected"
    />

    <events-edit-dialog
      :shown.sync="eventsShowEditDialog"
      :event="eventsStateSelected"
    />

    <events-participants-edit-dialog
      :shown.sync="eventsParticipantsShowEditDialog"
      :participant="eventsParticipantsEditItem"
      :event="eventsStateSelected"
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
import EventsDivisionsContestantsResultsList from "@/containers/events/divisions/contestants/results/EventsDivisionsContestantsResultsList"
import EventsDivisionsContestantsResultsCreateDialog from "@/containers/events/divisions/contestants/results/EventsDivisionsContestantsResultsCreateDialog"
import EventsEditDialog from "@/containers/events/EventsEditDialog"
import EventsParticipantsEditDialog from "@/containers/events/participants/EventsParticipantsEditDialog"

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
    EventsDivisionsContestantsResultsList,
    EventsDivisionsContestantsResultsCreateDialog,
    EventsEditDialog,
    EventsParticipantsEditDialog
  },

  data: () => ({
    activeTab: "participants",
    eventsParticipantsShowManageDialog: false,
    eventsDivisionsShowCreateDialog: false,
    clubsMembersShowCreateDialog: false,
    eventsDivisionsContestantsResultsShowCreateDialog: false,
    eventsShowEditDialog: false,
    eventsParticipantsShowEditDialog: false,
    eventsParticipantsEditItem: {}
  }),

  computed: {
    ...mapState("events", {
      eventsStateSelectedIsLoading: "selectedIsLoading",
      eventsStateSelected: "selected"
    }),

    eventsSelectedDuration() {
      if(!Object.keys(this.eventsStateSelected).length) {
        return
      }
      const { startsAt, endsAt } = this.eventsStateSelected
      return moment.duration(moment(endsAt).diff(startsAt)).humanize()
    }
  },

  async created() {
    await this.eventsActionsSelect({ id: this.$route.params.eventId })
  },

  methods: {
    ...mapActions("events", {
      eventsActionsSelect: "select"
    }),

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    },

    eventsParticipantsOpenManageDialog() {
      this.eventsParticipantsShowManageDialog = true
    },

    eventsDivisionsOpenCreateDialog() {
      this.eventsDivisionsShowCreateDialog = true
    },

    eventsDivisionsContestantsResultsOpenCreateDialog() {
      this.eventsDivisionsContestantsResultsShowCreateDialog = true
    },

    eventsOpenPrintDialog() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er ikke implementert enda"
      })
    },

    eventsOpenEditDialog() {
      this.eventsShowEditDialog = true
    },

    eventsParticipantsOpenEditDialog(participant) {
      this.eventsParticipantsShowEditDialog = true
      this.eventsParticipantsEditItem = participant
    },

    async eventsRemoveOne() {
      const event = this.eventsStateSelected
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
        await this.classesActionsRemoveOne(event)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${event.title} was removed from the database`
        })
        this.$router.push("/clubs")
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
