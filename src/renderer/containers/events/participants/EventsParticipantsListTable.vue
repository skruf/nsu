<style lang="stylus">
</style>

<template>
  <div class="events-participants-list-table">
    <search-form
      v-model="eventsParticipantsSearchFilter"
      placeholder="Search for participants by first or last name"
      @submit="eventsParticipantsActionsSetSearchFilter"
    />

    <div v-loading="eventsParticipantsIsLoading">
      <el-table
        :data="eventsParticipantsStateList"
        :sort-by="eventsParticipantsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="eventsParticipantsSelectionChange"
        @row-click="eventsParticipantsRowClick"
        @sort-change="eventsParticipantsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

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
          :sort-orders="eventsParticipantsSortOrders"
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
          prop="member.clubName"
          label="Club Name/Area"
          sortable="custom"
          :sort-orders="eventsParticipantsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.member.clubName }}
            </h6>
            <small class="small">
              {{ scope.row.member.clubArea }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="createdAt"
          label="Added On"
          sortable="custom"
          width="150px"
          :sort-orders="eventsParticipantsSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.member.createdAt | moment("MM.DD.YY") }}
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template
            slot="header"
            slot-scope="scope"
          >
            <div
              class="table-actions"
              :class="{ 'disabled': !eventsParticipantsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="eventsParticipantsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :command="{
                      handler: 'eventsParticipantsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> Remove participants
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="eventsParticipantsDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'eventsParticipantsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> Remove participant
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No participants yet.
          <el-button
            type="text"
            @click="eventsParticipantsOpenManageDialog"
          >
            Add a member?
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="eventsParticipantsStatePageSize"
        :current-page="eventsParticipantsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="eventsParticipantsStateCount"
        @size-change="eventsParticipantsActionsSetPageSize"
        @current-change="eventsParticipantsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm"
import Avatar from "@/components/Avatar"

export default {
  name: "EventsParticipantsListTable",

  components: {
    SearchForm,
    Avatar
  },

  props: {
    event: { type: Object, required: true }
  },

  data: () => ({
    eventsParticipantsSelection: [],
    eventsParticipantsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsStateList: "list",
      eventsParticipantsStateListIsLoading: "listIsLoading",
      eventsParticipantsStateRemoveOneIsLoading: "removeOneIsLoading",
      eventsParticipantsStateRemoveManyIsLoading: "removeManyIsLoading",
      eventsParticipantsStateCount: "count",
      eventsParticipantsStatePageSize: "pageSize",
      eventsParticipantsStatePageCurrent: "pageCurrent",
      eventsParticipantsStateSortBy: "sortBy"
    }),
    eventsParticipantsHasSelection() {
      return this.eventsParticipantsSelection.length > 0
    },
    eventsParticipantsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.eventsParticipantsMutationsSetSearchFilter(search) }
    },
    eventsParticipantsIsLoading() {
      return (
        this.eventsParticipantsStateListIsLoading ||
        this.eventsParticipantsStateRemoveOneIsLoading ||
        this.eventsParticipantsStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    this.eventsParticipantsMutationsSetListFilter({ eventId: this.event.id })
    await this.eventsParticipantsActionsList()
  },

  methods: {
    ...mapMutations("events/participants", {
      eventsParticipantsMutationsSetListFilter: "SET_LIST_FILTER",
      eventsParticipantsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("events/participants", {
      eventsParticipantsActionsList: "list",
      eventsParticipantsActionsRemoveOne: "removeOne",
      eventsParticipantsActionsRemoveMany: "removeMany",
      eventsParticipantsActionsSetPageSize: "setPageSize",
      eventsParticipantsActionsSetPageCurrent: "setPageCurrent",
      eventsParticipantsActionsSetSorting: "setSorting",
      eventsParticipantsActionsSetSearchFilter: "setSearchFilter"
    }),

    eventsParticipantsOpenManageDialog() {
      this.$emit("eventsParticipantsOpenManageDialog")
    },

    eventsParticipantsSelectionChange(participants) {
      this.eventsParticipantsSelection = participants
    },

    eventsParticipantsRowClick() {},

    eventsParticipantsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async eventsParticipantsRemoveOne(participant) {
      try {
        const fullName = `${participant.member.firstName} ${participant.member.lastName}`
        await this.$confirm(
          `This will remove ${fullName} permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.eventsParticipantsActionsRemoveOne(participant)
          this.$notify({
            title: "Success",
            message: `${fullName} was removed from the event`,
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
    },

    async eventsParticipantsRemoveMany() {
      try {
        const count = this.eventsParticipantsSelection.length
        await this.$confirm(
          `This will remove ${count} participants from the event permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.eventsParticipantsActionsRemoveMany(this.eventsParticipantsSelection)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${count} participants were removed from the event`
          })
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      } catch(e) {}
    }
  }
}
</script>
