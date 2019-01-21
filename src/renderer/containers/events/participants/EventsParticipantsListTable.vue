<style lang="stylus">
</style>

<template>
  <div class="events-participants">
    <search-form
      v-model="eventsParticipantsSearchFilter"
      placeholder="Search for participant by first or last name"
      @submit="eventsParticipantsSetSearchFilterAsync"
    />

    <el-table
      :data="eventsParticipantsList"
      :sort-by="eventsParticipantsSortBy"
      row-key="_id"
      class="table-clickable"
      empty-text
      @selection-change="eventsParticipantsSelectionChange"
      @row-click="eventsParticipantsRowClick"
      @sort-change="eventsParticipantsSetSortingAsync"
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
        <template slot="header">
          <div
            class="table-actions"
            :class="{ 'disabled': !eventsParticipantsHasSelection }"
          >
            <el-dropdown
              trigger="click"
              @command="eventsParticipantsTableDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="removeSelection">
                  <i class="el-icon-delete el-icon--left" /> Remove participants
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
        <template slot-scope="scope">
          <el-dropdown
            trigger="click"
            @command="eventsParticipantsTableRowDispatchActions"
          >
            <span class="el-dropdown-link">
              <i class="table-button el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ handler: 'remove', payload: scope.row }">
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
      :page-size="eventsParticipantsPageSize"
      :current-page="eventsParticipantsPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="eventsParticipantsCount"
      @size-change="eventsParticipantsSetPageSize"
      @current-change="eventsParticipantsSetPageCurrent"
    />
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
      eventsParticipantsList: "list",
      eventsParticipantsCount: "count",
      eventsParticipantsPageSize: "pageSize",
      eventsParticipantsPageCurrent: "pageCurrent",
      eventsParticipantsSortBy: "sortBy"
    }),
    eventsParticipantsHasSelection() {
      return this.eventsParticipantsSelection.length > 0
    },
    eventsParticipantsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.eventsParticipantsSetSearchFilter(search) }
    }
  },

  async created() {
    this.eventsParticipantsSetListFilter({ eventId: this.event._id })
    await this.eventsParticipantsListAsync()
  },

  methods: {
    ...mapMutations("events/participants", {
      eventsParticipantsSetListFilter: "SET_LIST_FILTER",
      eventsParticipantsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("events/participants", {
      eventsParticipantsListAsync: "listAsync",
      eventsParticipantsSetPageSize: "setPageSizeAsync",
      eventsParticipantsSetPageCurrent: "setPageCurrentAsync",
      eventsParticipantsSetSortingAsync: "setSortingAsync",
      eventsParticipantsSetSearchFilterAsync: "setSearchFilterAsync"
    }),
    eventsParticipantsOpenManageDialog() {
      this.$emit("eventsParticipantsOpenManageDialog")
    },
    eventsParticipantsSelectionChange(participants) {
      this.eventsParticipantsSelection = participants
    },

    eventsParticipantsTableDispatchActions() {},
    eventsParticipantsRowClick() {},
    eventsParticipantsTableRowDispatchActions() {}
  }
}
</script>
