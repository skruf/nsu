<style lang="stylus">
</style>

<template>
  <div class="clubs-members-list-table">
    <search-form
      v-model="clubsMembersSearchFilter"
      placeholder="Search for members by first or last name"
      @submit="clubsMembersSetSearchFilterAsync"
    />

    <div v-loading="clubsMembersListIsLoading || clubsMembersRemoveIsLoading">
      <el-table
        :data="clubsMembersList"
        :sort-by="clubsMembersSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="clubsMembersSelectionChange"
        @row-click="clubsMembersRowClick"
        @sort-change="clubsMembersSetSortingAsync"
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
              :first-name="scope.row.firstName"
              :last-name="scope.row.lastName"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="Name/Email"
          sortable="custom"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.firstName }} {{ scope.row.lastName }}
            </h6>
            <small class="small">
              {{ scope.row.emailAddress }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="createdAt"
          label="Added On"
          sortable="custom"
          width="150px"
          :sort-orders="clubsMembersSortOrders"
        >
          <template slot-scope="scope">
            {{ scope.row.createdAt | moment("MM.DD.YY") }}
          </template>
        </el-table-column>

        <el-table-column
          width="50"
          align="right"
        >
          <template slot="header">
            <div
              class="table-actions"
              :class="{ 'disabled': !clubsMembersHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="clubsMembersTableDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="removeSelection">
                    <i class="el-icon-delete el-icon--left" /> Remove selected
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="clubsMembersTableRowDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'clubsMembersRemove',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> Remove member
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          No members yet.
          <el-button
            type="text"
            @click="clubsMembersOpenCreateDialog"
          >
            Create new?
          </el-button>
        </template>
      </el-table>
    </div>

    <el-pagination
      layout="total, sizes, prev, pager, next"
      :page-size="clubsMembersPageSize"
      :current-page="clubsMembersPageCurrent"
      :page-sizes="[ 15, 30, 45, 60 ]"
      :total="clubsMembersCount"
      @size-change="clubsMembersSetPageSize"
      @current-change="clubsMembersSetPageCurrent"
    />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import SearchForm from "@/components/SearchForm"
import Avatar from "@/components/Avatar"

export default {
  name: "ClubsMembersListTable",

  components: {
    SearchForm,
    Avatar
  },

  props: {
    clubId: { type: String, required: true }
  },

  data: () => ({
    clubsMembersSelection: [],
    clubsMembersSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("clubs/members", {
      clubsMembersList: "list",
      clubsMembersCount: "count",
      clubsMembersPageSize: "pageSize",
      clubsMembersPageCurrent: "pageCurrent",
      clubsMembersSortBy: "sortBy",
      clubsMembersListIsLoading: "listIsLoading",
      clubsMembersRemoveIsLoading: "removeIsLoading"
    }),
    clubsMembersHasSelection() {
      return this.clubsMembersSelection.length > 0
    },
    clubsMembersSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMembersSetSearchFilter(search) }
    }
  },

  async created() {
    this.clubsMembersSetListFilter({ clubId: this.clubId })
    await this.clubsMembersListAsync()
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
      clubsMembersSetSearchFilterAsync: "setSearchFilterAsync",
      clubsMembersRemoveAsync: "removeAsync"
    }),
    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    },
    clubsMembersSelectionChange(members) {
      this.clubsMembersSelection = members
    },

    clubsMembersRowClick() {},
    clubsMembersTableDispatchActions() {},

    clubsMembersTableRowDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async clubsMembersRemove(clubMember) {
      try {
        await this.$confirm(
          `This will remove ${clubMember.firstName} ${clubMember.lastName} from the club. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.clubsMembersRemoveAsync({ id: clubMember.id })
          this.$notify({
            type: "success",
            title: "Success",
            message: `${clubMember.firstName} ${clubMember.lastName} was removed from the clubs database`
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
