<style lang="stylus">
</style>

<template>
  <el-container
    id="clubs-view-screen"
    v-loading="clubsSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/clubs', label: 'Clubs' },
          { to: `/clubs/${clubsSelected._id}`, label: clubsSelected.name }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ clubsSelected.name }}
          </h1>
          <small class="small">
            <span v-if="clubsSelected.address">
              {{ clubsSelected.address }}
            </span>
            <span v-if="clubsSelected.area">
              , {{ clubsSelected.area }}
            </span>
            <span v-if="clubsSelected.country">
              , {{ clubsSelected.country }}
            </span>
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="clubsSelectedDispatchActions"
          >
            <el-button type="text">
              <div class="flex items-center">
                <i class="ml-3 text-xl el-icon-arrow-down el-icon-more el-icon--left" />
              </div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="clubsSelectedUpdate">
                <i class="el-icon-edit el-icon--left" /> Edit
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-menu-delete"
                command="clubsSelectedRemove"
                divided
              >
                <i class="el-icon-delete el-icon--left" /> Delete
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <el-main>
      <div class="info-grid">
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Email:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsSelected.email }}
          </p>
        </div>
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Leader:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsSelected.leader }}
          </p>
        </div>
        <div
          v-if="clubsSelected.range"
          class="info-grid_item"
        >
          <h6 class="h6 info-grid_item_key">
            Range:
          </h6>
          <p class="info-grid_item_value">
            {{ clubsSelected.range.name }} ({{ clubsSelected.range.area }})
          </p>
        </div>
      </div>

      <div class="content">
        <clubs-members-list-table
          v-if="!clubsSelectedIsLoading"
          :club-id="clubsSelected._id"
          @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
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

    <clubs-members-create-dialog
      v-if="!clubsSelectedIsLoading"
      :club-id="clubsSelected._id"
      :club-name="clubsSelected.name"
      :shown.sync="clubsMembersShowCreateDialog"
    />
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"
import ClubsMembersListTable from "@/containers/clubs/members/ClubsMembersListTable"
import ClubsMembersCreateDialog from "@/containers/clubs/members/ClubsMembersCreateDialog"

export default {
  name: "ClubsViewScreen",

  components: {
    BreadcrumbBar,
    ClubsMembersListTable,
    ClubsMembersCreateDialog
  },

  data: () => ({
    clubsMembersShowCreateDialog: false
  }),

  computed: {
    ...mapState("clubs", {
      clubsSelectedIsLoading: "selectedIsLoading",
      clubsSelected: "selected"
    })
  },

  async created() {
    await this.clubsSelectAsync({ _id: this.$route.params.clubId })
  },

  methods: {
    ...mapActions("clubs", {
      clubsSelectAsync: "selectAsync"
    }),

    clubsSelectedDispatchActions() {},

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    }
  }
}
</script>
