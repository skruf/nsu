<i18n>
{
  "en": {
    "edit": "Edit division",
    "remove": "Remove division",
    "starts": "Starts",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create one?",
    "eventsDivisionsRemoveOneConfirmation": "This will remove %{division} permanently. Continue?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} was removed from the database",
    "placeholderText": "Select a division to see the shooting schedule",
    "contestants": "Participants",
    "results": "Results",
    "assignParticipants": "Assign stands"
  },
  "no": {
    "edit": "Rediger standplassliste",
    "remove": "Slett standplassliste",
    "starts": "Starter",
    "divisionsListPlaceholderText": "Ingen standplasslister enda.",
    "divisionsListPlaceholderButton": "Opprett ny?",
    "eventsDivisionsRemoveOneConfirmation": "Dette vil fjerne %{division} permanent. Fortsett?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} ble fjernet fra databasen",
    "placeholderText": "Velg en standplassliste først",
    "contestants": "Deltakere",
    "results": "Resultater",
    "assignParticipants": "Angi standplasser"
  }
}
</i18n>

<template>
  <div class="events-divisions-view flex h-full w-full">
    <events-divisions-list-menu
      @eventsDivisionsOpenCreateDialog="eventsDivisionsOpenCreateDialog"
      @selectDivision="setSelectedDivision"
    />

    <div class="flex-1 flex flex-col">
      <template v-if="division">
        <div class="flex items-center justify-between mt-5 px-5">
          <h2 class="h2 mb-2">
            {{ division.name }}

            <small class="small">
              {{ division.distance }}
            </small>
          </h2>

          <el-dropdown
            trigger="click"
            @command="dispatchActions"
          >
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{
                  handler: 'eventsDivisionsOpenEditDialog',
                  payload: division
                }"
              >
                <i class="el-icon-edit el-icon--left" />
                {{ $t("edit") }}
              </el-dropdown-item>
              <el-dropdown-item
                :command="{
                  handler: 'eventsDivisionsOpenPrintDialog',
                  payload: division
                }"
              >
                <i class="el-icon-printer el-icon--left" />
                Print division
              </el-dropdown-item>
              <el-dropdown-item
                divided
                class="dropdown-menu-delete"
                :command="{
                  handler: 'eventsDivisionsRemoveOne',
                  payload: division
                }"
              >
                <i class="el-icon-delete el-icon--left" />
                {{ $t("remove") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <small class="small px-5">
          {{ $t("starts") }} {{ division.day | moment("DD MMM") }}, {{ division.time }}
        </small>

        <div class="content">
          <events-contestants-list-table
            :division="division"
            @openAssignmentDialog="eventsDivisionsOpenAssignmentDialog"
          />
        </div>

        <el-footer height="auto">
          <el-button
            type="primary"
            @click="eventsDivisionsOpenAssignmentDialog"
          >
            <i class="el-icon-plus el-icon--left" />
            {{ $t("assignParticipants") }}
          </el-button>
        </el-footer>
      </template>

      <div
        v-else
        class="data-placeholder"
      >
        {{ $t("placeholderText") }}
      </div>
    </div>

    <events-divisions-create-dialog
      :shown.sync="eventsDivisionsShowCreateDialog"
    />

    <events-divisions-assignment-dialog
      v-if="division"
      :shown.sync="eventsDivisionsShowAssignmentDialog"
      :division="division"
    />

    <events-divisions-edit-dialog
      v-if="division"
      :shown.sync="eventsDivisionsShowEditDialog"
      :division.sync="division"
    />

    <!--
    <events-divisions-print-dialog
      :shown.sync="eventsDivisionsShowPrintDialog"
    />
    -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import EventsDivisionsCreateDialog from "~/containers/EventsDivisionsCreateDialog"
import EventsDivisionsEditDialog from "~/containers/EventsDivisionsEditDialog"
import EventsDivisionsListMenu from "~/containers/EventsDivisionsListMenu"
import EventsContestantsListTable from "~/containers/EventsContestantsListTable"
// import EventsDivisionsPrintDialog from "~/containers/EventsDivisionsPrintDialog"
import EventsDivisionsAssignmentDialog from "~/containers/EventsDivisionsAssignmentDialog"

export default {
  name: "EventsDivisionsView",

  components: {
    EventsDivisionsCreateDialog,
    EventsDivisionsEditDialog,
    EventsDivisionsListMenu,
    EventsContestantsListTable,
    // EventsDivisionsPrintDialog,
    EventsDivisionsAssignmentDialog
  },

  data: () => ({
    eventsDivisionsShowCreateDialog: false,
    eventsDivisionsShowEditDialog: false,
    eventsDivisionsShowPrintDialog: false,
    eventsDivisionsShowAssignmentDialog: false,
    division: null
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateRemoveOneIsLoading: "removeOneIsLoading"
    })
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsRemoveOne: "removeOne"
    }),
    eventsDivisionsOpenAssignmentDialog() {
      this.eventsDivisionsShowAssignmentDialog = true
    },
    setSelectedDivision(division) {
      this.division = division
    },
    eventsDivisionsOpenCreateDialog() {
      this.eventsDivisionsShowCreateDialog = true
    },
    eventsDivisionsOpenEditDialog() {
      this.eventsDivisionsShowEditDialog = true
    },
    eventsDivisionsOpenPrintDialog() {
      this.eventsDivisionsShowPrintDialog = true
    },
    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },
    async eventsDivisionsRemoveOne(division) {
      try {
        await this.$confirm(
          this.$t("eventsDivisionsRemoveOneConfirmation", {
            division: division.name
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.eventsDivisionsActionsRemoveOne(division)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsDivisionsActionsRemoveOneSuccess", {
            division: division.name
          })
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
