<style lang="stylus">
</style>

<template>
  <div class="events-divisions-list">
    <div
      v-for="division in eventsDivisionsStateList"
      :key="division.id"
      class="events-results_division mb-8"
    >
      <h2 class="h2 mb-2">
        {{ division.name }}
      </h2>
      <small class="small mb-4">
        Starts on: {{ division.day | moment("DD.MM") }} ends at: {{ division.endsAt }}
      </small>

      <events-divisions-contestants-list-table :division="division" />
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
import EventsDivisionsContestantsListTable from "@/containers/events/divisions/EventsDivisionsContestantsListTable"

export default {
  name: "EventsDivisionsList",

  components: { EventsDivisionsContestantsListTable },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsDivisionsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateCount: "count",
      eventsDivisionsStateList: "list"
    }),
    eventsDivisionsExists() {
      return (
        this.eventsDivisionsStateList &&
        this.eventsDivisionsStateList.length > 0
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
      eventsDivisionsActionsList: "list"
    }),
    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    }
  }
}
</script>
