<style lang="stylus">
</style>

<template>
  <el-container
    id="clubs-view-screen"
    v-loading="clubsStateSelectedIsLoading"
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
            @command="clubsDispatchActions"
          >
            <el-button type="text">
              <i class="el-icon-arrow-down el-icon-more" />
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
      v-if="!clubsStateSelectedIsLoading"
      :club-id="clubsStateSelected.id"
      :club-name="clubsStateSelected.name"
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

  computed: mapState("clubs", {
    clubsStateSelectedIsLoading: "selectedIsLoading",
    clubsStateSelected: "selected"
  }),

  async created() {
    await this.clubsActionsSelect({ id: this.$route.params.clubId })
  },

  methods: {
    ...mapActions("clubs", {
      clubsActionsSelect: "select"
    }),

    clubsDispatchActions() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er enda ikke implementert"
      })
    },

    clubsMembersOpenCreateDialog() {
      this.clubsMembersShowCreateDialog = true
    }
  }
}
</script>
