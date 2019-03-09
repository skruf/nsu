<style lang="stylus">
.events-divisions-contestants-list-table
  .el-table::before
    display none
</style>

<template>
  <div
    v-loading="eventsDivisionsContestantsStateListIsLoading"
    class="events-divisions-contestants-list-table"
  >
    <el-table
      :data="eventsDivisionsContestantsListLocal"
      row-key="id"
      empty-text
    >
      <el-table-column
        type="index"
        width="50"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      />

      <el-table-column
        prop="time"
        label="Shooting Time/Day"
        width="160"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.time }}
          </h6>
          <small class="small">
            {{ division.day | moment("DD.MM") }}
          </small>
        </template>
      </el-table-column>

      <el-table-column
        prop="member"
        width="60px"
      >
        <template slot-scope="scope">
          <avatar
            :first-name="scope.row.member.firstName"
            :last-name="scope.row.member.lastName"
          />
        </template>
      </el-table-column>

      <el-table-column
        prop="member"
        label="Name/Email"
        sortable="custom"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.member.firstName }} {{ scope.row.member.lastName }}
          </h6>
          <small class="small">
            {{ scope.row.member.emailAddress }}
          </small>
        </template>
      </el-table-column>

      <el-table-column
        prop="class.name"
        label="Class Name/Category"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      >
        <template slot-scope="scope">
          <h6 class="h6">
            {{ scope.row.class.name }}
          </h6>
          <small class="small">
            {{ scope.row.class.category }}
          </small>
        </template>
      </el-table-column>

      <el-table-column
        prop="calibre"
        label="Calibre"
        :sort-orders="eventsDivisionsContestantsSortOrders"
      />

      <!-- <el-table-column prop="member.clubName" label="Club" :sort-orders="eventsDivisionsContestantsSortOrders" /> -->
      <!-- <el-table-column width="50">
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

      <template slot="empty">
        No participants yet.
        <el-button
          type="text"
          disabled
        >
          Add one?
        </el-button>
      </template>
    </el-table>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex"
import Avatar from "@/components/Avatar"

export default {
  name: "EventsDivisionsContestantsListTable",

  components: { Avatar },

  props: {
    division: { type: Object, required: true }
  },

  data: () => ({
    eventsDivisionsContestantsSortOrders: [ "descending", "ascending" ],
    eventsDivisionsContestantsListLocal: []
  }),

  computed: mapState("events/divisions/contestants", {
    eventsDivisionsContestantsStateListIsLoading: "listIsLoading",
    eventsDivisionsContestantsStateCount: "count",
    eventsDivisionsContestantsStateList: "list"
  }),

  async created() {
    this.eventsDivisionsContestantsMutationsSetListFilter({
      divisionId: this.division.id
    })
    await this.eventsDivisionsContestantsActionsList()
    this.eventsDivisionsContestantsListLocal = [
      ...this.eventsDivisionsContestantsStateList
    ]
  },

  methods: {
    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),
    eventsDivisionsContestantsOpenCreateDialog() {
      this.$emit("eventsDivisionsContestantsOpenCreateDialog")
    }
  }
}
</script>
