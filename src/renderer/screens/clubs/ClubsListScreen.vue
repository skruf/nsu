<style lang="stylus">
</style>

<template>
  <el-container
    id="clubs-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/clubs', label: 'Clubs' },
          { to: '', label: 'All' }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          Clubs
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <clubs-list-table
        @clubsOpenCreateDialog="clubsOpenCreateDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="clubsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> Create club
      </el-button>
    </el-footer>

    <clubs-create-dialog
      :shown.sync="clubsShowCreateDialog"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "@/components/BreadcrumbBar"
import ClubsListTable from "@/containers/clubs/ClubsListTable"
import ClubsCreateDialog from "@/containers/clubs/ClubsCreateDialog"

export default {
  name: "ClubsListScreen",

  components: {
    BreadcrumbBar,
    ClubsListTable,
    ClubsCreateDialog
  },

  data: () => ({
    clubsShowCreateDialog: false
  }),

  methods: {
    clubsOpenCreateDialog() {
      this.clubsShowCreateDialog = true
    }
  }
}
</script>
