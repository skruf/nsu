<style lang="stylus">
.w-1\\/10
  width 10%

.results-cell
  padding 10px
  border-top 1px solid var(--border-color)

// .results-cell_hit

.division_class
  border-bottom 1px solid var(--border-color)
  padding-bottom 20px
</style>

<template>
  <div class="events-divisions-contestants-results-list">
    <div v-loading="eventsDivisionsContestantsResultsStateListIsLoading">
      <div
        v-for="division in eventsDivisions"
        :key="division.id"
        class="events-results_division mb-8"
      >
        <h2 class="h2 pb-4">
          {{ division.title }}
        </h2>

        <div
          v-for="divisionClass in division.classes"
          :key="divisionClass.id"
          class="division_class"
        >
          <h3 class="h3 py-4">
            {{ divisionClass.name }}
          </h3>

          <div class="class_results">
            <div class="flex w-full">
              <div class="results-cell h6 w-24">
                Rank
              </div>
              <div class="results-cell h6 w-24">
                Sum
              </div>
              <div class="results-cell h6 w-1/4">
                <span class="pl-4">
                  Contestant
                </span>
              </div>
              <div class="h6 w-2/3 flex text-center">
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #1
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #2
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #3
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #4
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #5
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #6
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #7
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #8
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #9
                </div>
                <div class="results-cell results-cell_hit h6 w-1/10">
                  #10
                </div>
              </div>
            </div>

            <!-- <div
              v-for="contestant in getResults(divisionClass.contestants)"
              :key="contestant.id"
              class="flex w-full"
            >
              <div class="results-cell w-24">
                #{{ contestant.rank }}
              </div>
              <div class="results-cell w-24">
                {{ contestant.result }}
              </div>
              <div class="results-cell w-1/4">
                <span class="pl-4">
                  {{ contestant.firstName }} {{ contestant.lastName }}
                </span>
              </div>
              <div class="w-2/3 flex text-center">
                <div
                  v-for="(hit, index) in contestant.hits"
                  :key="index"
                  class="results-cell results-cell_hit w-1/10"
                >
                  {{ hit.sum }}
                </div>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"

export default {
  name: "EventsDivisionsContestantsResultsList",

  props: {
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      eventsDivisions: []
    }
  },

  computed: {
    ...mapState("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsStateList: "list",
      eventsDivisionsContestantsResultsStateListIsLoading: "listIsLoading"
    }),

    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading"
    }),

    ...mapState("events/divisions", {
      eventsDivisionsStateList: "list",
      eventsDivisionsStateListIsLoading: "listIsLoading"
    })
  },

  async created() {
    this.eventsDivisionsContestantsResultsMutationsSetListFilter({
      eventId: this.event.id
    })
    await this.eventsDivisionsContestantsResultsActionsList()
  },

  methods: {
    ...mapMutations("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsMutationsSetListFilter: "SET_LIST_FILTER"
    }),

    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsList: "list"
    }),

    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list"
    })
  }
}
</script>
