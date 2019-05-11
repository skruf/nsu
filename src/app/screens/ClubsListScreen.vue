<i18n>
{
  "en": {
    "title": "Clubs",
    "breadcrumbLabel1": "Clubs",
    "breadcrumbLabel2": "All",
    "createClubButton": "Create club"
  },
  "no": {
    "title": "Klubber",
    "breadcrumbLabel1": "Klubber",
    "breadcrumbLabel2": "Alle",
    "createClubButton": "Opprett klubb"
  }
}
</i18n>

<template>
  <el-container
    id="clubs-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/clubs', label: $t('breadcrumbLabel1') },
          { to: '', label: $t('breadcrumbLabel2') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t("title") }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <clubs-list-table
        @clubsOpenCreateDialog="clubsOpenCreateDialog"
        @clubsOpenEditDialog="clubsOpenEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="clubsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" /> {{ $t("createClubButton") }}
      </el-button>
    </el-footer>

    <clubs-create-dialog
      :shown.sync="clubsShowCreateDialog"
    />

    <clubs-edit-dialog
      :shown.sync="clubsEditShowDialog"
      :club="clubsEditItem"
    />
  </el-container>
</template>

<script>
import BreadcrumbBar from "~/components/BreadcrumbBar"
import ClubsListTable from "~/containers/ClubsListTable"
import ClubsCreateDialog from "~/containers/ClubsCreateDialog"
import ClubsEditDialog from "~/containers/ClubsEditDialog"

export default {
  name: "ClubsListScreen",

  components: {
    BreadcrumbBar,
    ClubsListTable,
    ClubsCreateDialog,
    ClubsEditDialog
  },

  data: () => ({
    clubsShowCreateDialog: false,
    clubsEditShowDialog: false,
    clubsEditItem: {}
  }),

  methods: {
    clubsOpenCreateDialog() {
      this.clubsShowCreateDialog = true
    },
    clubsOpenEditDialog(club) {
      this.clubsEditShowDialog = true
      this.clubsEditItem = club
    }
  }
}
</script>
