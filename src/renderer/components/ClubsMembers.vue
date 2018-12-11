<style lang="stylus">
// .clubs-members
</style>

<template>
  <div class="clubs-members pt-2">
    <filter-form
      v-model="membersSarchFilter"
      @submit="membersFetchMany"
      placeholder="Search for members by first or last name"
    />

    <div class="table-actions" :class="{ 'disabled': !membersHasSelection }">
      <el-dropdown trigger="click" @command="membersTableDispatchActions">
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
      @selection-change="membersSelectionChange"
      @row-click="membersRowClick"
      @sort-change="membersSetSorting"
      :sort-by="membersSortBy"
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
      <el-table-column prop="emailAddress" label="Email" sortable="custom"></el-table-column>
      <el-table-column width="40">
        <template slot-scope="scope">
          <el-dropdown trigger="click" @command="membersTableRowDispatchActions">
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
        <el-button type="text" size="small" @click="clubsMembersOpenCreateOrAddDialog">
          Create/add new?
        </el-button>
      </template>
    </el-table>

    <el-pagination
      layout="total, sizes, prev, pager, next"
      @size-change="membersSetPageSize"
      @current-change="membersSetPageCurrent"
      :page-size="membersPageSize"
      :current-page="membersPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="membersCount"
    ></el-pagination>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex"
import FilterForm from "@/components/FilterForm"

export default {
  name: "ClubsMembers",

  components: {
    FilterForm
  },

  props: {
    clubId: { type: String, required: true }
  },

  data: () => ({
    membersSarchFilter: "",
    membersPageSize: 15,
    membersPageCurrent: 1,
    membersSortBy: "_id",
    membersSelection: [],
    membersCount: 6
  }),

  async created() {
    await this.clubsMembersListAsync({ clubId: this.clubId })
  },

  computed: {
    ...mapState("clubs/members", {
      clubsMembersList: "list"
    }),
    membersHasSelection() {
      return this.membersSelection.length > 0
    }
  },

  methods: {
    ...mapActions("clubs/members", {
      clubsMembersListAsync: "listAsync"
    }),

    membersTableDispatchActions() {},
    clubsMembersOpenCreateOrAddDialog() {
      this.$emit("clubsMembersOpenCreateOrAddDialog")
    },
    membersSelectionChange(members) {
      this.membersSelection = members
    },
    membersRowClick() {},
    membersSetSorting() {},
    membersFetchMany() {},
    membersSetPageSize() {},
    membersSetPageCurrent() {},
    membersTableRowDispatchActions() {}
  }
}
</script>
