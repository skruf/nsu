<style lang="stylus">
</style>

<template>
  <div class="clubs-members-list-table">
    <search-form
      v-model="clubsMembersSearchFilter"
      placeholder="Search for members by first or last name"
      @submit="clubsMembersActionsSetSearchFilter"
    />

    <div v-loading="clubsMembersIsLoading">
      <el-table
        :data="clubsMembersList"
        :sort-by="clubsMembersSortBy"
        row-key="id"
        empty-text
        @selection-change="clubsMembersSelectionChange"
        @sort-change="clubsMembersActionsSetSorting"
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
          prop="firstName"
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
                @command="clubsMembersDispatchActions"
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
              @command="clubsMembersDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'clubsMembersRemoveOne',
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
      @size-change="clubsMembersActionsSetPageSize"
      @current-change="clubsMembersActionsSetPageCurrent"
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
      clubsMembersRemoveOneIsLoading: "removeOneIsLoading",
      clubsMembersRemoveManyIsLoading: "removeManyIsLoading"
    }),
    clubsMembersHasSelection() {
      return this.clubsMembersSelection.length > 0
    },
    clubsMembersSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMembersMutationsSetSearchFilter(search) }
    },
    clubsMembersIsLoading() {
      return (
        this.clubsMembersListIsLoading ||
        this.clubsMembersRemoveOneIsLoading ||
        this.clubsMembersRemoveManyIsLoading
      )
    }
  },

  async created() {
    this.clubsMembersMutationsSetListFilter({ clubId: this.clubId })
    await this.clubsMembersActionsList()
  },

  methods: {
    ...mapMutations("clubs/members", {
      clubsMembersMutationsSetListFilter: "SET_LIST_FILTER",
      clubsMembersMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),
    ...mapActions("clubs/members", {
      clubsMembersActionsList: "list",
      clubsMembersActionsSetPageSize: "setPageSize",
      clubsMembersActionsSetPageCurrent: "setPageCurrent",
      clubsMembersActionsSetSorting: "setSorting",
      clubsMembersActionsSetSearchFilter: "setSearchFilter",
      clubsMembersActionsRemoveOne: "removeOne",
      clubsMembersActionsRemoveMany: "removeMany"
    }),
    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    },
    clubsMembersSelectionChange(members) {
      this.clubsMembersSelection = members
    },

    clubsMembersDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    async clubsMembersRemoveOne(clubMember) {
      try {
        const fullName = `${clubMember.firstName} ${clubMember.lastName}`
        await this.$confirm(
          `This will remove ${fullName} from the club. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.clubsMembersActionsRemoveOne(clubMember)
          this.$notify({
            type: "success",
            title: "Success",
            message: `${fullName} was removed from the clubs database`
          })
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      } catch(e) {}
    },

    async clubsMembersRemoveMany() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er ikke implementert enda"
      })

      // try {
      //   const count = this.clubsMembersSelection.length
      //   await this.$confirm(
      //     `This will remove ${count} club members permanently. Continue?`,
      //     "Warning!", {
      //       confirmButtonText: "Yes, I am sure",
      //       cancelButtonText: "Cancel",
      //       customClass: "dangerous-confirmation",
      //       type: "warning"
      //     }
      //   )
      //
      //   try {
      //     await this.clubsMembersActionsRemoveMany(this.clubsMembersSelection)
      //     this.$notify({
      //       type: "success",
      //       title: "Success",
      //       message: `${count} club members were removed from the database`
      //     })
      //   } catch(e) {
      //     this.$notify({
      //       type: "error",
      //       title: "Oops!",
      //       message: e.message
      //     })
      //   }
      // } catch(e) {}
    }
  }
}
</script>
