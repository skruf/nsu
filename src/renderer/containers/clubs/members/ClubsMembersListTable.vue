<style lang="stylus">
</style>

<template>
  <div class="clubs-members-list-table pt-2">
    <search-form
      v-model="clubsMembersSearchFilter"
      @submit="clubsMembersSetSearchFilterAsync"
      placeholder="Search for members by first or last name"
    />

    <div class="table-actions" :class="{ 'disabled': !clubsMembersHasSelection }">
      <el-dropdown trigger="click" @command="clubsMembersTableDispatchActions">
        <el-button type="text" size="small">
          Actions <i class="el-icon-arrow-down el-icon--left"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="removeSelection">
            <i class="el-icon-delete el-icon--left"></i> Remove members
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-table
      :data="clubsMembersList"
      @selection-change="clubsMembersSelectionChange"
      @row-click="clubsMembersRowClick"
      @sort-change="clubsMembersSetSortingAsync"
      :sort-by="clubsMembersSortBy"
      row-key="_id"
      class="table-clickable"
      empty-text
    >
      <el-table-column type="selection" width="30"></el-table-column>
      <el-table-column prop="name" label="Name" sortable="custom" :sort-orders="clubsMembersSortOrders">
        <template slot-scope="scope">
          {{ scope.row.firstName }} {{ scope.row.lastName }}
        </template>
      </el-table-column>
      <el-table-column prop="emailAddress" label="Email" sortable="custom" :sort-orders="clubsMembersSortOrders"></el-table-column>
      <el-table-column width="40">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="clubsMembersTableRowDispatchActions">
            <span class="el-dropdown-link">
              <i class="el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{ handler: 'remove', payload: scope.row }">
                <i class="el-icon-delete el-icon--left"></i> Remove member
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <template slot="empty">
        No members yet.
        <el-button type="text" size="small" @click="clubsMembersOpenCreateDialog">
          Create/add new?
        </el-button>
      </template>
    </el-table>

    <el-pagination
      layout="total, sizes, prev, pager, next"
      @size-change="clubsMembersSetPageSize"
      @current-change="clubsMembersSetPageCurrent"
      :page-size="clubsMembersPageSize"
      :current-page="clubsMembersPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="clubsMembersCount"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm"

export default {
  name: "ClubsMembersListTable",

  components: {
    SearchForm
  },

  props: {
    clubId: { type: String, required: true }
  },

  data: () => ({
    clubsMembersSelection: [],
    clubsMembersSortOrders: [ "descending", "ascending" ]
  }),

  async created() {
    this.clubsMembersSetListFilter({ clubId: this.clubId })
    await this.clubsMembersListAsync()
  },

  computed: {
    ...mapState("clubs/members", {
      clubsMembersList: "list",
      clubsMembersCount: "count",
      clubsMembersPageSize: "pageSize",
      clubsMembersPageCurrent: "pageCurrent",
      clubsMembersSortBy: "sortBy"
    }),
    clubsMembersHasSelection() {
      return this.clubsMembersSelection.length > 0
    },
    clubsMembersSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMembersSetSearchFilter(search) }
    }
  },

  methods: {
    ...mapMutations("clubs/members", {
      clubsMembersSetListFilter: "SET_LIST_FILTER",
      clubsMembersSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("clubs/members", {
      clubsMembersListAsync: "listAsync",
      clubsMembersSetPageSize: "setPageSizeAsync",
      clubsMembersSetPageCurrent: "setPageCurrentAsync",
      clubsMembersSetSortingAsync: "setSortingAsync",
      clubsMembersSetSearchFilterAsync: "setSearchFilterAsync"
    }),
    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    },
    clubsMembersSelectionChange(members) {
      this.clubsMembersSelection = members
    },

    clubsMembersRowClick() {},
    clubsMembersTableDispatchActions() {},
    clubsMembersTableRowDispatchActions() {}
  }
}
</script>
