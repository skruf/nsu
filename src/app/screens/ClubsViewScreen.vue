<i18n>
{
  "en": {
    "breadcrumb1Label": "Clubs",
    "editClub": "Edit club",
    "removeClub": "Remove club",
    "email": "Email",
    "leader": "Leader",
    "range": "Shooting Range",
    "clubsMembersOpenCreateDialog": "Create member",
    "clubsRemoveOneConfirmation": "This will remove %{club} and its %{members} members permanently. Continue?",
    "classesActionsRemoveOneSuccess": "%{club} was removed from the database"
  },
  "no": {
    "breadcrumb1Label": "Klubber",
    "editClub": "Rediger klubb",
    "removeClub": "Fjern klubb",
    "email": "Epost",
    "leader": "Leder",
    "range": "Skyttebane",
    "clubsMembersOpenCreateDialog": "Opprett medlem",
    "clubsRemoveOneConfirmation": "Dette vil fjerne %{club} og deres %{members} medlemmer permanent. Fortsett?",
    "classesActionsRemoveOneSuccess": "%{club} og deres %{members} ble fjernet fra databasen"
  }
}
</i18n>

<template>
  <el-container
    id="clubs-view-screen"
    v-loading="clubsIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/clubs',
          label: this.$t('breadcrumb1Label')
        }, {
          to: `/clubs/${clubsStateSelected.id}`,
          label: clubsStateSelected.name
        }]"
      />

      <div class="page-meta">
        <div class="page-titles flex">
          <div>
            <h1 class="h1">
              {{ clubsStateSelected.name }}
            </h1>

            <small class="small page-subtitles">
              <span
                v-if="clubsStateSelected.address"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.address }}
              </span>

              <span
                v-if="clubsStateSelected.area"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.area }}
              </span>

              <span
                v-if="clubsStateSelected.country"
                class="page-subtitles_part"
              >
                {{ clubsStateSelected.country }}
              </span>
            </small>
          </div>

          <div class="page-controls ml-2">
            <el-dropdown
              class="mt-1"
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
                  <i class="el-icon-edit el-icon--left" />
                  {{ $t("editClub") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  class="dropdown-menu-delete"
                  :command="{
                    handler: 'clubsRemoveOne'
                  }"
                >
                  <i class="el-icon-delete el-icon--left" />
                  {{ $t("removeClub") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

        <div class="page-info">
          <div
            v-if="clubsStateSelected.emailAddress"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.emailAddress }}
            </h5>
            <small class="small">
              {{ $t("email") }}
            </small>
          </div>

          <div
            v-if="clubsStateSelected.leader"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.leader }}
            </h5>
            <small class="small">
              {{ $t("leader") }}
            </small>
          </div>

          <div
            v-if="clubsStateSelected.range"
            class="page-info_item"
          >
            <h5 class="h5">
              {{ clubsStateSelected.range.name }}
              ({{ clubsStateSelected.range.area }})
            </h5>
            <small class="small">
              {{ $t("range") }}
            </small>
          </div>
        </div>
      </div>
    </el-header>

    <el-main>
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
        <i class="el-icon-plus el-icon--left" />
        {{ $t("clubsMembersOpenCreateDialog") }}
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
import BreadcrumbBar from "~/components/BreadcrumbBar"
import ClubsEditDialog from "~/containers/ClubsEditDialog"
import ClubsMembersListTable from "~/containers/ClubsMembersListTable"
import ClubsMembersCreateDialog from "~/containers/ClubsMembersCreateDialog"
import ClubsMembersEditDialog from "~/containers/ClubsMembersEditDialog"

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
      } catch(e) {
        return
      }

      try {
        await this.classesActionsRemoveOne(club)
        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("classesActionsRemoveOneSuccess", {
            club: club.name,
            members: club.membersCount
          })
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
