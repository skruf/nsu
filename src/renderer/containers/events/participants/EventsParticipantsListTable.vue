<style lang="stylus">
</style>

<template>
  <div class="events-participants pt-4">
    <search-form
      v-model="eventsParticipantsSearchFilter"
      @submit="eventsParticipantsSetSearchFilterAsync"
      placeholder="Search for participant by first or last name"
    />

    <div class="table-actions" :class="{ 'disabled': !eventsParticipantsHasSelection }">
      <el-dropdown trigger="click" @command="eventsParticipantsTableDispatchActions">
        <el-button type="text" size="small">
          Actions <i class="el-icon-arrow-down el-icon--left"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="removeSelection">
            <i class="el-icon-delete el-icon--left"></i> Remove participants
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="eventsParticipantsList"
      @selection-change="eventsParticipantsSelectionChange"
      @row-click="eventsParticipantsRowClick"
      @sort-change="eventsParticipantsSetSortingAsync"
      :sort-by="eventsParticipantsSortBy"
      row-key="_id"
      class="table-clickable"
      empty-text
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="name" label="Name" sortable="custom" :sort-orders="eventsParticipantsSortOrders">
        <template slot-scope="scope">
          {{ scope.row.firstName }} {{ scope.row.lastName }}
        </template>
      </el-table-column>
      <el-table-column prop="club" label="Club" sortable="custom" :sort-orders="eventsParticipantsSortOrders"></el-table-column>
      <el-table-column width="40">
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
      </el-table-column>
      <template slot="empty">
        No participants yet.
        <el-button type="text" size="small" @click="eventsParticipantsOpenCreateOrAddDialog">
          Create/add new?
        </el-button>
      </template>
    </el-table>

    <el-pagination
      layout="total, sizes, prev, pager, next"
      @size-change="eventsParticipantsSetPageSize"
      @current-change="eventsParticipantsSetPageCurrent"
      :page-size="eventsParticipantsPageSize"
      :current-page="eventsParticipantsPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="eventsParticipantsCount"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "EventsParticipantsListTable",

  components: {
    SearchForm
  },

  props: {
    eventId: { type: String, required: true }
  },

  data: () => ({
    eventsParticipantsSelection: [],
    eventsParticipantsSortOrders: [ "descending", "ascending" ]
  }),

  async created() {
    this.eventsParticipantsSetListFilter({ eventId: this.eventId })
    await this.eventsParticipantsListAsync()
  },

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
    eventsParticipantsOpenCreateOrAddDialog() {
      this.$emit("eventsParticipantsOpenCreateOrAddDialog")
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
