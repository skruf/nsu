<i18n>
{
  "en": {
    "edit": "Edit division",
    "remove": "Remove division",
    "divisionStartsAt": "Starts on",
    "divisionEndsAt": "and ends at",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create one?",
    "eventsDivisionsRemoveOneConfirmation": "This will remove %{division} permanently. Continue?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} was removed from the database",
    "placeholderText": "Select a division to see the shooting schedule",
    "contestants": "Participants",
    "results": "Results",
    "createDivision": "Create division",
    "inputResults": "Input results"
  },
  "no": {
    "edit": "Rediger divisjon",
    "remove": "Slett divisjon",
    "divisionStartsAt": "Starter den",
    "divisionEndsAt": "og slutter",
    "divisionsListPlaceholderText": "Ingen divisjoner enda.",
    "divisionsListPlaceholderButton": "Opprett ny?",
    "eventsDivisionsRemoveOneConfirmation": "Dette vil fjerne %{division} permanent. Fortsett?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} ble fjernet fra databasen",
    "placeholderText": "Velg en divisjon for å se standplasslisten",
    "contestants": "Deltakere",
    "results": "Resultater",
    "createDivision": "Opprett divisjon",
    "inputResults": "Angi resultater"
  }
}
</i18n>

<template>
  <div class="events-divisions-view flex h-full w-full">
    <events-divisions-list-menu
      @eventsDivisionsOpenCreateDialog="eventsDivisionsOpenCreateDialog"
    />

    <div class="flex-1 flex flex-col">
      <template v-if="hasEventsDivisionsSelected">
        <div class="flex items-center justify-between mt-5 px-5">
          <h2 class="h2 mb-2">
            {{ eventsDivisionsStateSelected.name }}
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
                  payload: eventsDivisionsStateSelected
                }"
              >
                <i class="el-icon-edit el-icon--left" />
                {{ $t("edit") }}
              </el-dropdown-item>
              <el-dropdown-item
                :command="{
                  handler: 'eventsDivisionsOpenPrintDialog',
                  payload: eventsDivisionsStateSelected
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
                  payload: eventsDivisionsStateSelected
                }"
              >
                <i class="el-icon-delete el-icon--left" />
                {{ $t("remove") }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <small class="small px-5">
          {{ $t("divisionStartsAt") }} {{ eventsDivisionsStateSelected.day | moment("DD.MM") }} {{ $t("divisionEndsAt") }} {{ eventsDivisionsStateSelected.endsAt }}
        </small>

        <el-tabs v-model="activeTab">
          <!-- v-if="!eventsStateSelectedIsLoading" -->
          <el-tab-pane
            name="contestants"
            :label="$t('contestants')"
          >
            <div class="content">
              <events-divisions-contestants-list-table
                @eventsDivisionsContestantsOpenEditDialog="eventsDivisionsOpenEditDialog"
              />
            </div>

            <el-footer height="auto">
              <el-button
                type="primary"
                @click="eventsDivisionsOpenCreateDialog"
              >
                <i class="el-icon-plus el-icon--left" />
                {{ $t("createDivision") }}
              </el-button>
            </el-footer>
          </el-tab-pane>

          <el-tab-pane
            name="results"
            :label="$t('results')"
          >
            <div class="content">
              <events-divisions-contestants-results-list
                @eventsDivisionsContestantsResultsOpenCreateDialog="eventsDivisionsContestantsResultsOpenCreateDialog"
              />
            </div>

            <el-footer height="auto">
              <el-button
                type="primary"
                @click="eventsDivisionsContestantsResultsOpenCreateDialog"
              >
                <i class="el-icon-plus el-icon--left" />
                {{ $t("inputResults") }}
              </el-button>
            </el-footer>
          </el-tab-pane>
        </el-tabs>
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

    <events-divisions-edit-dialog
      :shown.sync="eventsDivisionsShowEditDialog"
    />

    <events-divisions-print-dialog
      :shown.sync="eventsDivisionsShowPrintDialog"
    />

    <events-divisions-contestants-results-create-dialog
      :shown.sync="eventsDivisionsContestantsResultsShowCreateDialog"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import EventsDivisionsCreateDialog from "@/containers/EventsDivisionsCreateDialog"
import EventsDivisionsEditDialog from "@/containers/EventsDivisionsEditDialog"
import EventsDivisionsListMenu from "@/containers/EventsDivisionsListMenu"
import EventsDivisionsContestantsListTable from "@/containers/EventsDivisionsContestantsListTable"
import EventsDivisionsPrintDialog from "@/containers/EventsDivisionsPrintDialog"
import EventsDivisionsContestantsResultsList from "@/containers/EventsDivisionsContestantsResultsList"
import EventsDivisionsContestantsResultsCreateDialog from "@/containers/EventsDivisionsContestantsResultsCreateDialog"

export default {
  name: "EventsDivisionsView",

  components: {
    EventsDivisionsCreateDialog,
    EventsDivisionsEditDialog,
    EventsDivisionsListMenu,
    EventsDivisionsContestantsListTable,
    EventsDivisionsPrintDialog,
    EventsDivisionsContestantsResultsList,
    EventsDivisionsContestantsResultsCreateDialog
  },

  data: () => ({
    activeTab: "contestants",
    eventsDivisionsShowCreateDialog: false,
    eventsDivisionsShowEditDialog: false,
    eventsDivisionsShowPrintDialog: false,
    eventsDivisionsContestantsResultsShowCreateDialog: false
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsDivisionsStateSelected: "selected"
    }),
    hasEventsDivisionsSelected() {
      return Object.keys(this.eventsDivisionsStateSelected).length > 0
    }
  },

  methods: {
    ...mapActions("events/divisions", {
      eventsDivisionsActionsRemoveOne: "removeOne"
    }),
    eventsDivisionsOpenCreateDialog() {
      this.eventsDivisionsShowCreateDialog = true
    },
    eventsDivisionsOpenEditDialog() {
      this.eventsDivisionsShowEditDialog = true
    },
    eventsDivisionsContestantsResultsOpenCreateDialog() {
      this.eventsDivisionsContestantsResultsShowCreateDialog = true
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
