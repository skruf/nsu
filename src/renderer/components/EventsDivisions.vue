<style lang="stylus">
// .events-divisions
</style>

<template>
  <div class="events-divisions">
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

        <div class="class_weapon">
          <h3 class="h3">Weapon</h3>
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

        <div class="class_rules">
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

        <div class="class_contestants">
          <h3 class="h3">Contestants</h3>
          <div
            v-for="contestant in divisionClass.contestants"
            :key="contestant._id"
            class="flex w-full"
          >
            <div class="">{{ contestant.firstName }} {{ contestant.lastName }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-actions">
      <el-button @click="divisionsOpenCreateDialog" type="primary">
        <i class="el-icon-plus el-icon--right"></i> Create division
      </el-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "EventsDivisions",

  components: {
  },

  data: () => ({
    divisionsShowCreateDialog: false

    // participantsSarchFilter: "",
    // participantsPageSize: 15,
    // participantsPageCurrent: 1,
    // participantsSortBy: "_id",
    // participantsSelection: [],
    // participantsCount: 6
  }),

  async created() {
  },

  computed: {
    ...mapState("events", [
      "participants",
      "divisions"
    ])

    // participantsHasSelection() {
    //   return this.participantsSelection.length > 0
    // }
  },

  methods: {
    divisionsOpenCreateDialog() {
      this.divisionsShowCreateDialog = true
    }

    // participantsTableDispatchActions() {},
    // participantsOpenCreateOrAddDialog() {},
    // participantsSelectionChange(participants) {
    //   this.participantsSelection = participants
    // },
    // participantsRowClick() {},
    // participantsSetSorting() {},
    // participantsFetchMany() {},
    // participantsSetPageSize() {},
    // participantsSetPageCurrent() {},
    // participantsTableRowDispatchActions() {}
  }
}
</script>
