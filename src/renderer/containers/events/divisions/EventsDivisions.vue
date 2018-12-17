<style lang="stylus">
// .events-divisions
</style>

<template>
  <div class="events-divisions">
    <div
      v-for="division in eventsDivisionsList"
      :key="division._id"
      class="events-results_division"
    >
      <h2 class="h2 mt-8 mb-2">{{ division.name }}</h2>
      <small class="small mb-4">
        Starts on: {{ division.day | moment("MM-DD") }} ends at: {{ division.endsAt }}
      </small>

      <el-table
        :data="division.contestants"
        row-key="_id"
        empty-text
      >
        <el-table-column type="index" width="50" :sort-orders="eventsDivisionsSortOrders" />
        <el-table-column prop="time" label="Shoots at" width="100" :sort-orders="eventsDivisionsSortOrders" />
        <el-table-column prop="member" label="Name" :sort-orders="eventsDivisionsSortOrders">
          <template slot-scope="scope">
            {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
          </template>
        </el-table-column>
        <el-table-column prop="class.name" label="Class" :sort-orders="eventsDivisionsSortOrders" />
        <el-table-column prop="calibre" label="Calibre" :sort-orders="eventsDivisionsSortOrders" />
        <!-- <el-table-column prop="member.clubName" label="Club" :sort-orders="eventsDivisionsSortOrders" /> -->
        <!-- <el-table-column width="40">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="eventsParticipantsTableRowDispatchActions">
              <span class="el-dropdown-link">
                <i class="el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ handler: 'remove', payload: scope.row }">
                  <i class="el-icon-delete el-icon--left"></i> Remove participant
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column> -->
        <!-- <template slot="empty">
          No participants yet.
          <el-button type="text" @click="eventsParticipantsOpenManageDialog">
            Add a member?
          </el-button>
        </template> -->
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"

export default {
  name: "EventsDivisions",

  props: {
    eventId: { type: String, required: true }
  },

  async created() {
    this.eventsDivisionsSetListFilter({ eventId: this.eventId })
    await this.eventsDivisionsListAsync()
  },

  computed: {
    ...mapState("events/divisions", {
      eventsDivisionsListIsLoading: "listIsLoading",
      eventsDivisionsCount: "count",
      eventsDivisionsList: "list"
    })
  },

  data: () => ({
    eventsDivisionsSortOrders: [ "descending", "ascending" ]
  }),

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
