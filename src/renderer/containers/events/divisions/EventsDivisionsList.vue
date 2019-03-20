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
                handler: 'eventsDivisionsRemoveOne',
                payload: division
              }"
            >
              <i class="el-icon-delete el-icon--left" /> Remove selected
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <small class="small mb-4">
        Starts on {{ division.day | moment("DD.MM") }} ends at: {{ division.endsAt }} o'clock
      </small>

      <events-divisions-contestants-list-table
        :division="division"
      />
    </div>

    <div
      v-if="!eventsDivisionsExists"
      class="data-placeholder"
    >
      No divisions yet.
      <el-button
        type="text"
        @click="eventsDivisionsOpenCreateDialog"
      >
        Create one?
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

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async eventsDivisionsRemoveOne(division) {
      try {
        await this.$confirm(
          `This will remove ${division.name} permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.eventsDivisionsActionsRemoveOne(division)
          this.$notify({
            title: "Success",
            message: `${division.name} was removed from the database`,
            type: "success"
          })
        } catch(e) {
          this.$notify({
            title: "Oops!",
            message: e.message,
            type: "error"
          })
        }
      } catch(e) {}
    }
  }
}
</script>
