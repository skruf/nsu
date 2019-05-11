<i18n>
{
  "en": {
    "searchFormPlaceholder": "Search for a club by name",
    "column1Label": "Name",
    "column2Label": "Area/Address",
    "column3Label": "Leader/Email",
    "column4Label": "Members",
    "removeSelected": "Remove selected",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "tablePlaceholderButton": "Create new?",
    "tablePlaceholderText": "No clubs yet.",
    "clubsRemoveOneConfirmation": "This will remove %{club} and its %{members} members. Continue?",
    "clubsRemoveOneSuccess": "%{club} and its %{members} members were removed from the database"
  },
  "no": {
    "searchFormPlaceholder": "Søk etter en klubb med navn",
    "column1Label": "Navn",
    "column2Label": "Område/Adresse",
    "column3Label": "Leder/Epost",
    "column4Label": "Medlemmer",
    "removeSelected": "Slett valgte",
    "editClub": "Rediger klubb",
    "removeClub": "Slett klubb",
    "tablePlaceholderButton": "Opprett ny?",
    "tablePlaceholderText": "Ingen klubber enda.",
    "clubsRemoveOneConfirmation": "Dette vil slette %{club} og deres %{members} medlemmer. Fortsett?",
    "clubsRemoveOneSuccess": "%{club} og deres %{members} medlemmer ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <div class="clubs-list-table">
    <search-form
      v-model="clubsSearchFilter"
      class="mb-5"
      :placeholder="$t('searchFormPlaceholder')"
      @submit="clubsActionsSetSearchFilter"
    />

    <div v-loading="clubsIsLoading">
      <el-table
        :data="clubsStateList"
        :sort-by="clubsStateSortBy"
        row-key="id"
        class="table-clickable"
        empty-text
        @selection-change="clubsSelectionChange"
        @row-click="clubsRowClick"
        @sort-change="clubsActionsSetSorting"
      >
        <el-table-column
          type="selection"
          width="40"
        />

        <el-table-column
          prop="name"
          sortable="custom"
          :label="$t('column1Label')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.name }}
            </h6>
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          sortable="custom"
          :label="$t('column2Label')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.area }}
            </h6>
            <small class="small">
              {{ scope.row.address }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="leader"
          sortable="custom"
          :label="$t('column3Label')"
          :sort-orders="clubsSortOrders"
        >
          <template slot-scope="scope">
            <h6 class="h6">
              {{ scope.row.leader }}
            </h6>
            <small class="small">
              {{ scope.row.emailAddress || "N/A" }}
            </small>
          </template>
        </el-table-column>

        <el-table-column
          prop="membersCount"
          width="115px"
          :label="$t('column4Label')"
          :sort-orders="clubsSortOrders"
        />

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
              :class="{ 'disabled': !clubsHasSelection }"
            >
              <el-dropdown
                trigger="click"
                @command="clubsDispatchActions"
              >
                <span class="el-dropdown-link">
                  <i class="table-button el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    class="dropdown-menu-delete"
                    :command="{
                      handler: 'clubsRemoveMany'
                    }"
                  >
                    <i class="el-icon-delete el-icon--left" /> {{ $t('removeSelected') }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>

          <template slot-scope="scope">
            <el-dropdown
              trigger="click"
              @command="clubsDispatchActions"
            >
              <span class="el-dropdown-link">
                <i class="table-button el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  :command="{
                    handler: 'clubsEditOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-edit el-icon--left" /> {{ $t('editClub') }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'clubsRemoveOne',
                    payload: scope.row
                  }"
                >
                  <i class="el-icon-delete el-icon--left" /> {{ $t('removeClub') }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>

        <template slot="empty">
          {{ $t("tablePlaceholderText") }}
          <el-button
            type="text"
            @click="clubsOpenCreateDialog"
          >
            {{ $t("tablePlaceholderButton") }}
          </el-button>
        </template>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next"
        :page-size="clubsStatePageSize"
        :current-page="clubsStatePageCurrent"
        :page-sizes="[ 15, 30, 45, 60 ]"
        :total="clubsStateCount"
        @size-change="clubsActionsSetPageSize"
        @current-change="clubsActionsSetPageCurrent"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import SearchForm from "~/components/SearchForm"

export default {
  name: "ClubsListTable",

  components: {
    SearchForm
  },

  data: () => ({
    clubsSelection: [],
    clubsSortOrders: [ "descending", "ascending" ]
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateListIsLoading: "listIsLoading",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateRemoveManyIsLoading: "removeManyIsLoading",
      clubsStateSortBy: "sortBy",
      clubsStatePageSize: "pageSize",
      clubsStatePageCurrent: "pageCurrent",
      clubsStateCount: "count",
      clubsStateList: "list"
    }),
    clubsHasSelection() {
      return this.clubsSelection.length > 0
    },
    clubsSearchFilter: {
      get() { return this.$store.state.clubs.searchFilterValue },
      set(search) { this.clubsMutationsSetSearchFilter(search) }
    },
    clubsIsLoading() {
      return (
        this.clubsStateListIsLoading ||
        this.clubsStateRemoveOneIsLoading ||
        this.clubsStateRemoveManyIsLoading
      )
    }
  },

  async created() {
    await this.clubsActionsList()
  },

  methods: {
    ...mapMutations("clubs", {
      clubsMutationsSetSearchFilter: "SET_SEARCH_FILTER"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list",
      clubsActionsRemoveOne: "removeOne",
      clubsActionsRemoveMany: "removeMany",
      clubsActionsSetSorting: "setSorting",
      clubsActionsSetPageSize: "setPageSize",
      clubsActionsSetPageCurrent: "setPageCurrent",
      clubsActionsSetSearchFilter: "setSearchFilter"
    }),

    clubsOpenCreateDialog() {
      this.$emit("clubsOpenCreateDialog")
    },

    clubsRowClick(club, column, e) {
      if(!e.target.className.includes("table-button")) {
        this.$router.push(`/clubs/${club.id}`)
      }
    },

    clubsSelectionChange(clubs) {
      this.clubsSelection = clubs
    },

    clubsDispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsEditOne(club) {
      this.$emit("clubsOpenEditDialog", club)
    },

    async clubsRemoveOne(club) {
      try {
        await this.$confirm(
          this.$t("clubsRemoveOneConfirmation", {
            club: club.name,
            members: club.membersCount
          }),
          this.$t("warning"), {
            confirmButtonText: this.$t("confirmButtonText"),
            cancelButtonText: this.$t("cancel"),
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )

        try {
          await this.clubsActionsRemoveOne(club)
          this.$notify({
            type: "success",
            title: this.$t("success"),
            message: this.$t("clubsRemoveOneSuccess", {
              club: club.name,
              members: club.membersCount
            })
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

    async clubsRemoveMany() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er ikke implementert enda"
      })

      // try {
      //   const count = this.clubsSelection.length
      //   await this.$confirm(
      //     `This will remove ${count} clubs and their members permanently. Continue?`,
      //     this.$t("warning"), {
      //       confirmButtonText: "Yes, I am sure",
      //       cancelButtonText: "Cancel",
      //       customClass: "dangerous-confirmation",
      //       type: "warning"
      //     }
      //   )
      //
      //   try {
      //     await this.clubsActionsRemoveMany(this.clubsSelection)
      //     this.$notify({
      //       type: "success",
      //       title: "Success",
      //       message: `${count} clubs were removed from the database`
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
