<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="clubs-list-screen">
    <el-header height="auto">
      <h1 class="h1 text-4xl">Clubs</h1>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/clubs' }">Clubs</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/clubs' }">All</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <clubs-list-table
        @clubsOpenCreateDialog="clubsOpenCreateDialog"
      />

      <div class="page-actions">
        <el-button @click="clubsOpenCreateDialog" type="primary">
          <i class="el-icon-plus el-icon--left"></i> Create club
        </el-button>
      </div>
    </el-main>

    <clubs-create-dialog
      :shown.sync="clubsShowCreateDialog"
    />
  </el-container>
</template>

<script>
import ClubsListTable from "@/containers/clubs/ClubsListTable"
import ClubsCreateDialog from "@/containers/clubs/ClubsCreateDialog"

export default {
  name: "ClubsListScreen",

  components: {
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
