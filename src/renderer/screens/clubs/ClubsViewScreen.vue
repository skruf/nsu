<style lang="stylus">
</style>

<template>
  <el-container
    id="clubs-view-screen"
    v-loading="clubsIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/clubs', label: 'Clubs' },
          { to: `/clubs/${clubsStateSelected.id}`, label: clubsStateSelected.name }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ clubsStateSelected.name }}
          </h1>
          <small class="small">
            <span v-if="clubsStateSelected.address">
              {{ clubsStateSelected.address }}
            </span>
            <span v-if="clubsStateSelected.area">
              , {{ clubsStateSelected.area }}
            </span>
            <span v-if="clubsStateSelected.country">
              , {{ clubsStateSelected.country }}
            </span>
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="dispatchActions"
          >
            <el-button type="text">
              <i class="el-icon-arrow-down el-icon-more" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="{
                  handler: 'clubsEditOpenDialog'
                }"
              >
                <i class="el-icon-edit el-icon--left" /> Edit club
              </el-dropdown-item>

              <el-dropdown-item
                divided
                class="dropdown-menu-delete"
                :command="{
                  handler: 'clubsRemoveOne'
                }"
              >
                <i class="el-icon-delete el-icon--left" /> Remove club
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <div class="info-grid">
        <div
          v-if="clubsStateSelected.email"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Email:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsStateSelected.email }}
          </p>
        </div>
        <div
          v-if="clubsStateSelected.leader"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Leader:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsStateSelected.leader }}
          </p>
        </div>
        <div
          v-if="clubsStateSelected.range"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Range:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsStateSelected.range.name }} ({{ clubsStateSelected.range.area }})
          </p>
        </div>
      </div>

      <div class="content">
        <clubs-members-list-table
          v-if="!clubsStateSelectedIsLoading"
          :club-id="clubsStateSelected.id"
          @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
          @clubsMembersOpenEditDialog="clubsMembersOpenEditDialog"
        />
      </div>
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="clubsMembersOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> Create member
      </el-button>
    </el-footer>

    <clubs-edit-dialog
      :shown.sync="clubsEditShowDialog"
      :club="clubsStateSelected"
    />

    <clubs-members-create-dialog
      :shown.sync="clubsMembersShowCreateDialog"
      :club="clubsStateSelected"
    />

    <clubs-members-edit-dialog
      :shown.sync="clubsMembersShowEditDialog"
      :club="clubsStateSelected"
      :club-member="clubsMembersEditItem"
    />
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import ClubsEditDialog from "@/containers/clubs/ClubsEditDialog"
import ClubsMembersListTable from "@/containers/clubs/members/ClubsMembersListTable"
import ClubsMembersCreateDialog from "@/containers/clubs/members/ClubsMembersCreateDialog"
import ClubsMembersEditDialog from "@/containers/clubs/members/ClubsMembersEditDialog"

export default {
  name: "ClubsViewScreen",

  components: {
    BreadcrumbBar,
    ClubsEditDialog,
    ClubsMembersListTable,
    ClubsMembersCreateDialog,
    ClubsMembersEditDialog
  },

  data: () => ({
    clubsMembersShowCreateDialog: false,
    clubsEditShowDialog: false,
    clubsMembersShowEditDialog: false,
    clubsMembersEditItem: {}
  }),

  computed: {
    ...mapState("clubs", {
      clubsStateSelectedIsLoading: "selectedIsLoading",
      clubsStateRemoveOneIsLoading: "removeOneIsLoading",
      clubsStateSelected: "selected"
    }),
    clubsIsLoading() {
      return (
        this.clubsStateSelectedIsLoading ||
        this.clubsStateRemoveOneIsLoading
      )
    }
  },

  async created() {
    await this.clubsActionsSelect({ id: this.$route.params.clubId })
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsSelect: "select",
      classesActionsRemoveOne: "removeOne"
    }),

    dispatchActions({ handler, payload }) {
      this[handler](payload)
    },

    clubsEditOpenDialog() {
      this.clubsEditShowDialog = true
    },

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    },

    clubsMembersOpenEditDialog(member) {
      this.clubsMembersShowEditDialog = true
      this.clubsMembersEditItem = member
    },

    async clubsRemoveOne() {
      const club = this.clubsStateSelected
      try {
        await this.$confirm(
          `This will remove ${club.name} and its ${club.membersCount} members permanently. Continue?`,
          "Warning!", {
            confirmButtonText: "Yes, I am sure",
            cancelButtonText: "Cancel",
            customClass: "dangerous-confirmation",
            type: "warning"
          }
        )
      } catch(e) {
        return
      }

      try {
        await this.classesActionsRemoveOne(club)
        this.$notify({
          type: "success",
          title: "Success",
          message: `${club.name} was removed from the database`
        })
        this.$router.push("/clubs")
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    }
  }
}
</script>
