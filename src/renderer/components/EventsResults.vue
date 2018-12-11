<style lang="stylus">
.events-results
  .info-grid
    margin-top 10px

.events-results
  max-height calc(60vh + 8px)
  overflow-y scroll

.weapon-picture
  max-height 80px

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
    <div
      v-for="division in divisions"
      :key="division._id"
      class="events-results_division"
    >
      <h2 class="h2 pt-8 pb-4">{{ division.title }}</h2>

      <div
        v-for="divisionClass in division.classes"
        :key="divisionClass._id"
        class="division_class"
      >
        <h3 class="h3 py-4">{{ divisionClass.name }}</h3>

        <div class="class_weapon hidden">
          <img class="class_weapon_picture" :src="divisionClass.weapon.pictureUrl" />
          <div class="info-grid">
            <div
              v-for="(value, key, index) in divisionClass.weapon"
              :key="index"
              class="info-grid_item"
            >
              <h4 class="info-grid_item_key h4">{{ key }}:</h4>
              <div class="info-grid_item_value">{{ value }}</div>
            </div>
          </div>
        </div>

        <div class="class_rules hidden">
          <h3 class="h3">Rules</h3>
          <div class="info-grid">
            <div
              v-for="(value, key, index) in divisionClass.rules"
              :key="index"
              class="info-grid_item"
            >
              <h4 class="info-grid_item_key h4">{{ key }}:</h4>
              <div class="info-grid_item_value">{{ value }}</div>
            </div>
          </div>
        </div>

        <div class="class_results">
          <div class="flex w-full">
            <div class="results-cell h4 w-24">Rank</div>
            <div class="results-cell h4 w-24">Sum</div>
            <div class="results-cell h4 w-1/4"><span class="pl-4">Contestant</span></div>
            <div class="h4 w-2/3 flex text-center">
              <div class="results-cell results-cell_hit h4 w-1/10">#1</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#2</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#3</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#4</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#5</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#6</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#7</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#8</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#9</div>
              <div class="results-cell results-cell_hit h4 w-1/10">#10</div>
            </div>
          </div>

          <div
            v-for="contestant in getResults(divisionClass.contestants)"
            :key="contestant._id"
            class="flex w-full"
          >
            <div class="results-cell w-24">#{{ contestant.rank }}</div>
            <div class="results-cell w-24">{{ contestant.result }}</div>
            <div class="results-cell w-1/4">
              <span class="pl-4">{{ contestant.firstName }} {{ contestant.lastName }}</span>
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
    _id: 0,
    firstName: "Ola",
    lastName: "Dunk",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ola@dunk.no",
    country: "Norway",
    phoneNumber: "4044404"
  }, {
    _id: 1,
    firstName: "Per",
    lastName: "Arne",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "per@arne.no",
    country: "Norway",
    phoneNumber: "9045423"
  }, {
    _id: 2,
    firstName: "Ingar",
    lastName: "Hagen",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ingar@hagen.no",
    country: "Sweden",
    phoneNumber: "3234814"
  }, {
    _id: 3,
    firstName: "Ola",
    lastName: "Dunk",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "ola@dunk.no",
    country: "Norway",
    phoneNumber: "4044404"
  }, {
    _id: 4,
    firstName: "Per",
    lastName: "Arne",
    club: "Skedsmo Civile Skydeselskab",
    emailAddress: "per@arne.no",
    country: "Norway",
    phoneNumber: "9045423"
  }, {
    _id: 5,
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
    _id: 0,
    number: 1,
    name: "Miquelet",
    pictureUrl: "https://norsksvartkruttunion.no/wp-content/uploads/2014/03/Miquelet.png",

    rules: {
      target: "200 meters fransk militær geværskive",
      position: "Stående",
      loadingRod: "Tillatt, maks. 10 cm",
      cleaning: "Ikke tillatt",
      distance: "50 meter",
      team: "Nr. 9 Gustav Adolph (O) nr. 31 Halikko (R)"
    },

    weapon: {
      condition: "Orginal & Replika",
      type: "Glattløpet militær flinlåsmuskett",
      sights: "I original tro utførelse, intet baksikte",
      trigger: "Orginal ikke snellert",
      calibre: "13.5mm / 0.5315\"",
      bullet: "Rund"
    },

    contestants: contestantsMock
  },
  {
    _id: 1,
    number: 2,
    name: "Maximilian",
    pictureUrl: "https://norsksvartkruttunion.no/wp-content/uploads/2014/03/Miquelet.png",

    rules: {
      target: "ISSF 50 meters pistolskive",
      position: "Liggende",
      loadingRod: "Tillatt",
      cleaning: "Tillatt",
      distance: "100 meter",
      team: "Nr. 26 Wedgnock (O), Nr. 19 Luca (R)"
    },

    weapon: {
      condition: "Orginal & Replika",
      type: "Fri flinlåsrifle",
      sights: "Tidsriktige. Disse kan være originale modeller i replika utførelse, også diopter",
      trigger: "Snellert tillatt",
      calibre: "Fritt",
      bullet: "Rund"
    },

    contestants: contestantsMock
  }
]

const divisionsMock = [
  {
    _id: 0,
    title: "Day 1",
    classes: classesMock
  },
  {
    _id: 1,
    title: "Day 2",
    classes: classesMock
  }
]

export default {
  name: "EventsResults",

  components: {
  },

  data: () => ({
    participants: [],
    divisions: []
  }),

  async created() {
    this.participants = participantsMock
    this.divisions = divisionsMock
  },

  computed: {
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
