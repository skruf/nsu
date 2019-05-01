<i18n>
{
  "en": {
    "edit": "Edit division",
    "remove": "Remove division",
    "divisionStartStop": "Starts on %{day} ends at: %{time} o'clock",
    "divisionsListPlaceholderText": "No divisions yet.",
    "divisionsListPlaceholderButton": "Create one?",
    "eventsDivisionsRemoveOneConfirmation": "This will remove %{division} permanently. Continue?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} was removed from the database"
  },
  "no": {
    "edit": "Rediger divisjon",
    "remove": "Slett divisjon",
    "divisionStartStop": "Starter den %{day} slutter klokka %{time}",
    "divisionsListPlaceholderText": "Ingen divisjoner enda.",
    "divisionsListPlaceholderButton": "Opprett ny?",
    "eventsDivisionsRemoveOneConfirmation": "Dette vil fjerne %{division} permanent. Fortsett?",
    "eventsDivisionsActionsRemoveOneSuccess": "%{division} ble fjernet fra databasen"
  }
}
</i18n>

<style lang="stylus">
.events-results_division:not(:first-child)
  border-top 1px solid var(--border-color)
  padding-top 2rem
</style>

<template>
  <div class="events-divisions-list">
    <div
      v-for="division in eventsDivisionsStateList"
      :key="division.id"
      v-loading="eventsDivisionsIsLoading"
      class="events-results_division mb-8"
    >
      <div class="flex items-center justify-between">
        <h2 class="h2 mb-2">
          {{ division.name }}
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

      <small class="small mb-4">
        {{
          $t("divisionStartStop", {
            day: division.day, // | moment("DD.MM"),
            time: division.endsAt
          })
        }}
      </small>

      <events-divisions-contestants-list-table
        :division="division"
      />
    </div>

    <div
      v-if="!eventsDivisionsExists"
      class="data-placeholder"
    >
      {{ $t("divisionsListPlaceholderText") }}
      <el-button
        type="text"
        @click="eventsDivisionsOpenCreateDialog"
      >
        {{ $t("divisionsListPlaceholderButton") }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"
import EventsDivisionsContestantsListTable from "@/containers/events/divisions/contestants/EventsDivisionsContestantsListTable"

export default {
  name: "EventsDivisionsList",

  components: {
    EventsDivisionsContestantsListTable
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsDivisionsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsDivisionsStateCount: "count",
      eventsDivisionsStateList: "list"
    }),

    eventsDivisionsExists() {
      return (
        this.eventsDivisionsStateList &&
        this.eventsDivisionsStateList.length > 0
      )
    },

    eventsDivisionsIsLoading() {
      return (
        this.eventsDivisionsStateListIsLoading ||
        this.eventsDivisionsStateRemoveOneIsLoading
      )
    }
  },

  async created() {
    this.eventsDivisionsMutationsSetListFilter({ eventId: this.event.id })
    await this.eventsDivisionsActionsList()
  },

  methods: {
    ...mapMutations("events/divisions", {
      "eventsDivisionsMutationsSetListFilter": "SET_LIST_FILTER"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list",
      eventsDivisionsActionsRemoveOne: "removeOne"
    }),

    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    },

    eventsDivisionsOpenEditDialog(division) {
      this.$emit("eventsDivisionsOpenEditDialog", division)
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
