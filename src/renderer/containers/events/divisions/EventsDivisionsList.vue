<style lang="stylus">
// .events-divisions-list
</style>

<template>
  <div class="events-divisions-list">
    <div
      v-for="division in eventsDivisionsList"
      :key="division._id"
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
      eventsDivisionsListIsLoading: "listIsLoading",
      eventsDivisionsCount: "count",
      eventsDivisionsList: "list"
    })
  },

  async created() {
    this.eventsDivisionsSetListFilter({ eventId: this.event._id })
    await this.eventsDivisionsListAsync()
  },

  methods: {
    ...mapMutations("events/divisions", {
      "eventsDivisionsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions", {
      eventsDivisionsListAsync: "listAsync"
    }),
    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    }
  }
}
</script>
