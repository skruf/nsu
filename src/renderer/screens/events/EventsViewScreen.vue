<style lang="stylus">
.el-tabs__header
  margin-bottom 0
</style>

<template>
  <el-container class="screen" id="events-view-screen" v-loading="eventsSelectedIsLoading">
    <el-header height="auto">
      <div class="page-titles">
        <h1 class="h1 text-4xl">{{ eventsSelected.title }}</h1>
        <el-tag>Approbated</el-tag>
      </div>

      <div class="page-controls">
        <el-dropdown trigger="click" @command="eventsSelectedDispatchActions">
          <el-button type="text">
            <div class="flex items-center">
              Actions <i class="ml-3 text-2xl el-icon-arrow-down el-icon-setting el-icon--left"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="eventsSelectedPrint">
              <i class="el-icon-printer el-icon--left"></i> Print
            </el-dropdown-item>
            <el-dropdown-item command="eventsSelectedUpdate">
              <i class="el-icon-edit el-icon--left"></i> Edit
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-menu-delete" command="eventsSelectedRemove" divided>
              <i class="el-icon-delete el-icon--left"></i> Delete
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/events' }">Events</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/events/${eventsSelected._id}` }">{{ eventsSelected.title }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="info-grid">
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Starts at:</h3>
          <p class="info-grid_item_value">
            <date-with-tooltip :date="eventsSelected.startsAt" />
          </p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">End at:</h3>
          <p class="info-grid_item_value">
            <date-with-tooltip :date="eventsSelected.endsAt" />
          </p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Duration:</h3>
          <p class="info-grid_item_value">
            {{ eventsSelectedDuration }}
          </p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Category:</h3>
          <p class="info-grid_item_value">{{ eventsSelected.category }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Branch:</h3>
          <p class="info-grid_item_value">{{ eventsSelected.branch }}</p>
        </div>
        <div class="info-grid_item" v-if="eventsSelected.lat && eventsSelected.lng">
          <h3 class="h4 info-grid_item_key">Lat/Lng:</h3>
          <p class="info-grid_item_value">{{ eventsSelected.lat }} {{ eventsSelected.lng }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Area:</h3>
          <p class="info-grid_item_value">{{ eventsSelected.area }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Organizer:</h3>
          <p class="info-grid_item_value">{{ eventsSelected.organizer }}</p>
        </div>
      </div>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="Participants" name="participants">

          <events-participants
            v-if="!eventsSelectedIsLoading"
            :eventId="eventsSelected._id"
            @eventsParticipantsShowCreateOrAddDialog="eventsParticipantsShowCreateOrAddDialog"
          />

          <div class="page-actions">
            <el-button @click="eventsParticipantsOpenCreateOrAddDialog" type="primary">
              <i class="el-icon-plus el-icon--right"></i> Add / Create participants
            </el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Divisions" name="divisions">
          <!-- <events-divisions /> -->
        </el-tab-pane>

        <el-tab-pane label="Results" name="results">
          <events-results />
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <events-participants-create-or-add-dialog
      v-if="!eventsSelectedIsLoading"
      ref="eventsParticipantsCreateDialog"
      :eventId="eventsSelected._id"
      :eventTitle="eventsSelected.title"
      :shown.sync="eventsParticipantsShowCreateOrAddDialog"
      :isLoading="eventsParticipantsCreateIsLoading"
      @submit="eventsParticipantsCreateFormSubmit"
    />
  </el-container>
</template>

<script>
import moment from "moment"
import { mapActions, mapState } from "vuex"
import DateWithTooltip from "@/components/DateWithTooltip"
import EventsParticipants from "@/components/EventsParticipants"
import EventsParticipantsCreateOrAddDialog from "@/components/EventsParticipantsCreateOrAddDialog"
import EventsDivisions from "@/components/EventsDivisions"
import EventsResults from "@/components/EventsResults"

export default {
  name: "EventsViewScreen",

  components: {
    DateWithTooltip,
    EventsParticipants,
    EventsParticipantsCreateOrAddDialog,
    EventsDivisions,
    EventsResults
  },

  data: () => ({
    activeTab: "participants",
    eventsParticipantsShowCreateOrAddDialog: false
  }),

  async created() {
    await this.eventsSelectAsync({ _id: this.$route.params.eventId })
  },

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

  methods: {
    ...mapActions("events", {
      eventsSelectAsync: "selectAsync"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsCreateFormSubmit: "createAsync"
    }),

    eventsSelectedDispatchActions() {},

    eventsParticipantsOpenCreateOrAddDialog() {
      this.eventsParticipantsShowCreateOrAddDialog = true
    }
  }
}
</script>
