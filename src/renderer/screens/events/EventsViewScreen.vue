<i18n>
{
  "en": {
    "breadcrumb1Label": "Events",
    "mapRange": "Show range on map",
    "printEvent": "Print event",
    "editEvent": "Edit event",
    "removeEvent": "Remove event",
    "startsAt": "Starts at",
    "endsAt": "Ends at",
    "category": "Category",
    "participants": "Participants",
    "createMember": "Create club member",
    "manageParticipants": "Manage participants",
    "divisions": "Divisions",
    "createDivision": "Create division",
    "results": "Results",
    "inputResults": "Input results",
    "eventsRemoveOneConfirmation": "This will remove %{event} permanently. Continue?",
    "eventsActionsRemoveOneSuccess": "%{event} was removed from the database"
  },
  "no": {
    "breadcrumb1Label": "Stevner",
    "mapRange": "Vis skyttebane på kart",
    "printEvent": "Print stevne",
    "editEvent": "Rediger stevne",
    "removeEvent": "Slett stevne",
    "startsAt": "Starter",
    "endsAt": "Slutter",
    "category": "Kategori",
    "participants": "Deltakere",
    "createMember": "Opprett klubbmedlem",
    "manageParticipants": "Håndter deltakere",
    "divisions": "Divisjoner",
    "createDivision": "Opprett divisjon",
    "results": "Resultater",
    "inputResults": "Fyll inn resultater",
    "eventsRemoveOneConfirmation": "Dette vil fjerne %{event} permanent. Fortsett?",
    "eventsActionsRemoveOneSuccess": "%{event} ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <el-container
    id="events-view-screen"
    v-loading="eventsIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/events',
          label: $t('breadcrumb1Label')
        }, {
          to: `/events/${eventsStateSelected.id}`,
          label: eventsStateSelected.title
        }]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <div class="flex items-center">
            <div class="mr-2 text-xl">
              <template v-if="eventsStateSelected.approbated">
                <i class="el-icon-star-on" />
              </template>
              <template v-else>
                <i class="el-icon-star-off" />
              </template>
            </div>

            <h1 class="h1">
              {{ eventsStateSelected.title }}
            </h1>

            <div class="page-controls ml-2">
              <el-dropdown
                trigger="click"
                @command="dispatchActions"
              >
                <el-button type="text">
                  <i class="el-icon-arrow-down el-icon-more" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-if="eventsStateSelected.range"
                    :disabled="!(eventsStateSelected.range.lat && eventsStateSelected.range.lng)"
                    :command="{
                      handler: 'eventsRangeOpenMap'
                    }"
                  >
                    <i class="el-icon-location el-icon--left" />
                    {{ $t("mapRange") }}
                  </el-dropdown-item>
                  <!-- <el-dropdown-item
                    :command="{
                      handler: 'eventsOpenPrintDialog'
                    }"
                  >
                    <i class="el-icon-printer el-icon--left" />
                    {{ $t("printEvent") }}
                  </el-dropdown-item> -->
                  <el-dropdown-item
                    :command="{
                      handler: 'eventsOpenEditDialog'
                    }"
                  >
                    <i class="el-icon-edit el-icon--left" />
                    {{ $t("editEvent") }}
                  </el-dropdown-item>
                  <el-dropdown-item
                    divided
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'eventsRemoveOne'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" />
                    {{ $t("removeEvent") }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <small class="small page-subtitles">
            <span
              v-if="eventsStateSelected.range"
              class="page-subtitles_part"
            >
              {{ eventsStateSelected.range.name }}
            </span>

            <span
              v-if="eventsStateSelected.club"
              class="page-subtitles_part"
            >
              {{ eventsStateSelected.club.name }}
            </span>
          </small>
        </div>

        <div class="page-info">
          <div
            v-if="eventsStateSelected.startsAt"
            class="page-info_item"
          >
            <h5 class="h5">
              <date-with-tooltip :date="eventsStateSelected.startsAt" />
            </h5>
            <small class="small">
              {{ $t("startsAt") }}
            </small>
          </div>

          <div
            v-if="eventsStateSelected.endsAt"
            class="page-info_item"
          >
            <h5 class="h5">
              <date-with-tooltip :date="eventsStateSelected.endsAt" />
            </h5>
            <small class="small">
              {{ $t("endsAt") }}
            </small>
          </div>

          <div class="page-info_item">
            <h5 class="h5">
              {{ eventsStateSelected.category }}
            </h5>
            <small class="small">
              {{ $t("category") }}
            </small>
          </div>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-tabs v-model="activeTab">
        <el-tab-pane
          name="participants"
          :label="$t('participants')"
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
              <i class="el-icon-plus el-icon--left" />
              {{ $t("createMember") }}
            </el-button>
            <el-button
              type="primary"
              @click="eventsParticipantsOpenManageDialog"
            >
              <i class="ion-ios-keypad el-icon--left" />
              {{ $t("manageParticipants") }}
            </el-button>
          </el-footer>
        </el-tab-pane>

        <el-tab-pane
          name="divisions"
          :label="$t('divisions')"
        >
          <div class="content p-0">
            <events-divisions-view
              v-if="!eventsStateSelectedIsLoading"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
    />

    <events-participants-manager-dialog
      v-if="!eventsStateSelectedIsLoading"
      :shown.sync="eventsParticipantsShowManageDialog"
      :event="eventsStateSelected"
      @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
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

import EventsParticipantsListTable from "@/containers/EventsParticipantsListTable"
import EventsParticipantsManagerDialog from "@/containers/EventsParticipantsManagerDialog"
import EventsParticipantsEditDialog from "@/containers/EventsParticipantsEditDialog"
import EventsDivisionsView from "@/containers/EventsDivisionsView"
import EventsEditDialog from "@/containers/EventsEditDialog"
import ClubsMembersCreateDialog from "@/containers/ClubsMembersCreateDialog"

export default {
  name: "EventsViewScreen",

  components: {
    BreadcrumbBar,
    DateWithTooltip,
    EventsParticipantsListTable,
    EventsParticipantsManagerDialog,
    ClubsMembersCreateDialog,
    EventsDivisionsView,
    EventsEditDialog,
    EventsParticipantsEditDialog
  },

  data: () => ({
    activeTab: "participants",
    eventsParticipantsShowManageDialog: false,
    clubsMembersShowCreateDialog: false,
    eventsShowEditDialog: false,
    eventsParticipantsShowEditDialog: false,
    eventsParticipantsEditItem: {}
  }),

  computed: {
    ...mapState("events", {
      eventsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsStateSelectedIsLoading: "selectedIsLoading",
      eventsStateSelected: "selected"
    }),

    eventsSelectedDuration() {
      if(!Object.keys(this.eventsStateSelected).length) return
      const { startsAt, endsAt } = this.eventsStateSelected
      return moment.duration(moment(endsAt).diff(startsAt)).humanize()
    },

    eventsIsLoading() {
      return (
        this.eventsStateSelectedIsLoading ||
        this.eventsStateRemoveOneIsLoading
      )
    }
  },

  async created() {
    await this.eventsActionsSelect({ id: this.$route.params.eventId })
  },

  methods: {
    ...mapActions("events", {
      eventsActionsSelect: "select",
      eventsActionsRemoveOne: "removeOne"
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

    eventsRangeOpenMap() {
      const { range } = this.eventsStateSelected
      window.open(`https://www.google.com/maps/@${range.lat},${range.lng},15z`)
    },

    // eventsOpenPrintDialog() {
    //   this.$notify({
    //     type: "warning",
    //     title: "Oops!",
    //     message: "Denne funksjonen er ikke implementert enda"
    //   })
    // },

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
          this.$t("eventsRemoveOneConfirmation", {
            event: event.title
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
        await this.eventsActionsRemoveOne(event)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("eventsActionsRemoveOneSuccess", {
            event: event.title
          })
        })
        this.$router.push("/")
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
