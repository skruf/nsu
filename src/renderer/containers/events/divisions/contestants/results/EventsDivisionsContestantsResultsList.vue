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
  <div class="events-results">
    <el-alert
      title="Work in progress"
      description="Denne delen av programmet er ikke implementert enda, og nedenfor er bare et midlertidig forslag til oppsett av resultatlisten."
      type="warning"
      show-icon
      class="mb-5"
    />

    <div
      v-for="division in divisions"
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

          <div
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapState } from "vuex"

const participantsMock = [
  {
    id: 0,
    firstName: "Ola",
    lastName: "Dunk",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ola@dunk.no",
    country: "Norway",
    phoneNumber: "4044404"
  }, {
    id: 1,
    firstName: "Per",
    lastName: "Arne",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "per@arne.no",
    country: "Norway",
    phoneNumber: "9045423"
  }, {
    id: 2,
    firstName: "Ingar",
    lastName: "Hagen",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ingar@hagen.no",
    country: "Sweden",
    phoneNumber: "3234814"
  }, {
    id: 3,
    firstName: "Ola",
    lastName: "Dunk",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ola@dunk.no",
    country: "Norway",
    phoneNumber: "4044404"
  }, {
    id: 4,
    firstName: "Per",
    lastName: "Arne",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "per@arne.no",
    country: "Norway",
    phoneNumber: "9045423"
  }, {
    id: 5,
    firstName: "Ingar",
    lastName: "Hagen",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ingar@hagen.no",
    country: "Sweden",
    phoneNumber: "3234814"
  }
]

const contestantsMock = participantsMock.map((participant) => ({
  ...participant,
  result: 0,
  hits: [
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" },
    { sum: Math.floor(Math.random() * 10) + 1, comment: "" }
  ]
}))

const classesMock = [
  {
    id: 0,
    number: 1,
    name: "Miquelet",
    contestants: contestantsMock
  },
  {
    id: 1,
    number: 2,
    name: "Maximilian",
    contestants: contestantsMock
  }
]

const divisionsMock = [
  {
    id: 0,
    title: "Day 1",
    classes: classesMock
  },
  {
    id: 1,
    title: "Day 2",
    classes: classesMock
  }
]

export default {
  name: "EventsResults",

  data: () => ({
    divisions: []
  }),

  async created() {
    this.divisions = divisionsMock
  },

  methods: {
    getResults(contestants) {
      const withResult = contestants.map((contestant) => {
        let total = 0
        contestant.hits.forEach(({ sum }) => { total += sum })
        return {
          ...contestant,
          result: total
        }
      })

      withResult.sort((a, b) => {
        if(a.result < b.result) return 1
        if(a.result > b.result) return -1
        return 0
      })

      const withRank = withResult.map((contestant, index) => ({
        ...contestant,
        rank: index
      }))

      return withRank
    }
  }
}
</script>
