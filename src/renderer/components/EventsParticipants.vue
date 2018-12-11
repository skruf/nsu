<style lang="stylus">
// .events-participants
</style>

<template>
  <div class="events-participants pt-4">
    <search-form
      v-model="eventsParticipantsSarchFilter"
      @submit="eventsParticipantsFetchMany"
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
      :data="eventsParticipantsListMembers"
      @selection-change="eventsParticipantsSelectionChange"
      @row-click="eventsParticipantsRowClick"
      @sort-change="eventsParticipantsSetSorting"
      :sort-by="eventsParticipantsSortBy"
      row-key="_id"
      class="table-clickable"
      empty-text
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="name" label="Name" sortable="custom">
        <template slot-scope="scope">
          {{ scope.row.firstName }} {{ scope.row.lastName }}
        </template>
      </el-table-column>
      <el-table-column prop="club" label="Club" sortable="custom"></el-table-column>
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
import { mapActions, mapState } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "EventsParticipants",

  components: {
    SearchForm
  },

  props: {
    eventId: { type: String, required: true }
  },

  data: () => ({
    eventsParticipantsSarchFilter: "",
    eventsParticipantsPageSize: 15,
    eventsParticipantsPageCurrent: 1,
    eventsParticipantsSortBy: "_id",
    eventsParticipantsSelection: [],
    eventsParticipantsCount: 6
  }),

  async created() {
    await this.listParticipantsAsync({ eventId: this.eventId })
  },

  computed: {
    ...mapState("events/participants", {
      eventsParticipantsListMembers: "list"
    }),
    ...mapState("clubs/members", {
      clubsMembersList: "list"
    }),
    eventsParticipantsHasSelection() {
      return this.eventsParticipantsSelection.length > 0
    }
  },

  methods: {
    ...mapActions("events/participants", {
      listParticipantsAsync: "listAsync"
    }),

    eventsParticipantsTableDispatchActions() {},
    eventsParticipantsOpenCreateOrAddDialog() {
      this.$emit("eventsParticipantsOpenCreateOrAddDialog")
    },
    eventsParticipantsSelectionChange(participants) {
      this.eventsParticipantsSelection = participants
    },
    eventsParticipantsRowClick() {},
    eventsParticipantsSetSorting() {},
    eventsParticipantsFetchMany() {},
    eventsParticipantsSetPageSize() {},
    eventsParticipantsSetPageCurrent() {},
    eventsParticipantsTableRowDispatchActions() {}
  }
}
</script>
