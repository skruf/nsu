<style lang="stylus">
</style>

<template>
  <el-container class="screen" id="clubs-view-screen" v-loading="clubsSelectedIsLoading">
    <el-header height="auto">
      <div class="page-titles">
        <h1 class="h1 text-4xl">{{ clubsSelected.name }}</h1>
      </div>

      <div class="page-controls">
        <el-dropdown trigger="click" @command="clubsSelectedDispatchActions">
          <el-button type="text">
            <div class="flex items-center">
              Actions <i class="ml-3 text-2xl el-icon-arrow-down el-icon-setting el-icon--left"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="clubsSelectedUpdate">
              <i class="el-icon-edit el-icon--left"></i> Edit
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-menu-delete" command="clubsSelectedRemove" divided>
              <i class="el-icon-delete el-icon--left"></i> Delete
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/clubs' }">Clubs</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/clubs/${clubsSelected._id}` }">{{ clubsSelected.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="info-grid">
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Area:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.area }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Address:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.address }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Country:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.country }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Email:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.email }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Email:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.email }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Leader:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.leader }}</p>
        </div>
        <div class="info-grid_item">
          <h3 class="h4 info-grid_item_key">Range:</h3>
          <p class="info-grid_item_value">{{ clubsSelected.range }}</p>
        </div>
      </div>

      <clubs-members
        v-if="!clubsSelectedIsLoading"
        :clubId="clubsSelected._id"
        @clubsMembersOpenCreateOrAddDialog="clubsMembersOpenCreateOrAddDialog"
      />

      <div class="page-actions">
        <el-button @click="clubsMembersOpenCreateOrAddDialog" type="primary">
          <i class="el-icon-plus el-icon--right"></i> Add / Create members
        </el-button>
      </div>
    </el-main>

    <clubs-members-create-or-add-dialog
      v-if="!clubsSelectedIsLoading"
      ref="clubsMembersCreateOrAddDialog"
      :clubId="clubsSelected._id"
      :clubName="clubsSelected.name"
      :shown.sync="clubsMembersShowCreateOrAddDialog"
      :isLoading="clubsMembersCreateIsLoading"
      @submit="clubsMembersCreateFormSubmit"
    />
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import FilterForm from "@/components/FilterForm"
import ClubsMembers from "@/components/ClubsMembers"
import ClubsMembersCreateOrAddDialog from "@/components/ClubsMembersCreateOrAddDialog"

export default {
  name: "ClubsViewScreen",

  components: {
    FilterForm,
    ClubsMembers,
    ClubsMembersCreateOrAddDialog
  },

  data: () => ({
    clubsMembersShowCreateOrAddDialog: false
  }),

  async created() {
    await this.clubsSelectAsync({ _id: this.$route.params.clubId })
  },

  computed: {
    ...mapState("clubs", {
      clubsSelectedIsLoading: "selectedIsLoading",
      clubsSelected: "selected",
      clubsMembersCreateIsLoading: "createIsLoading"
    })
  },

  methods: {
    ...mapActions("clubs", {
      clubsSelectAsync: "selectAsync"
    }),
    ...mapActions("clubs/members", {
      clubsMembersCreateAsync: "createAsync"
    }),

    clubsSelectedDispatchActions() {},

    clubsMembersOpenCreateOrAddDialog() {
      this.clubsMembersShowCreateOrAddDialog = true
    },
    async clubsMembersCreateFormSubmit(form) {
      try {
        await this.clubsMembersCreateAsync(form)
        this.$notify({
          title: "Great success",
          message: `${form.firstName} ${form.lastName} was successfully added to the database`,
          type: "success"
        })
        this.$refs.clubsMembersCreateOrAddDialog.clear()
        this.clubsMembersShowCreateOrAddDialog = false
      } catch(e) {
        this.$notify({
          title: "Oops!",
          message: e.message,
          type: "error"
        })
      }
    }
  }
}
</script>
