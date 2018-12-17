<style lang="stylus">
.screen#classes-view-screen
  .el-main
    align-items baseline
  .info-grid_item
    width 50%
  .h6
    text-transform capitalize
</style>

<template>
  <el-container class="screen" id="classes-view-screen" v-loading="classesSelectedIsLoading">
    <el-header height="auto">
      <div class="page-titles">
        <h1 class="h1 text-4xl">{{ classesSelected.name }}</h1>
        <small class="small">#{{ classesSelected.number }}</small>
      </div>

      <div class="page-controls">
        <el-dropdown trigger="click" @command="classesSelectedDispatchActions">
          <el-button type="text">
            <div class="flex items-center">
              Actions <i class="ml-3 text-2xl el-icon-arrow-down el-icon-setting el-icon--left"></i>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="classesSelectedUpdate">
              <i class="el-icon-edit el-icon--left"></i> Edit
            </el-dropdown-item>
            <el-dropdown-item class="dropdown-menu-delete" command="classesSelectedRemove" divided>
              <i class="el-icon-delete el-icon--left"></i> Delete
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <div class="breadcrumb-bar">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/classes' }">Classes</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/classes/${classesSelected._id}` }">{{ classesSelected.name }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-main>
      <div class="info-grid">
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">category:</h6>
          <p class="info-grid_item_value">{{ classesSelected.category }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">condition:</h6>
          <p class="info-grid_item_value">{{ classesSelected.condition }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">target:</h6>
          <p class="info-grid_item_value">{{ classesSelected.target }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">position:</h6>
          <p class="info-grid_item_value">{{ classesSelected.position }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">distance:</h6>
          <p class="info-grid_item_value">{{ classesSelected.distance }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">type:</h6>
          <p class="info-grid_item_value">{{ classesSelected.type }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">sight:</h6>
          <p class="info-grid_item_value">{{ classesSelected.sight }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">trigger:</h6>
          <p class="info-grid_item_value">{{ classesSelected.trigger }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">calibre:</h6>
          <p class="info-grid_item_value">{{ classesSelected.calibre }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">bulletType:</h6>
          <p class="info-grid_item_value">{{ classesSelected.bulletType }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">loadingRod:</h6>
          <p class="info-grid_item_value">{{ classesSelected.loadingRod }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">cleaning:</h6>
          <p class="info-grid_item_value">{{ classesSelected.cleaning }}</p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">team:</h6>
          <p class="info-grid_item_value">{{ classesSelected.team }}</p>
        </div>
      </div>

      <div class="class_remarks mt-2" v-if="classesSelected.remarks">
        <h6 class="h6">Remarks:</h6>
        <p class="p mt-5">{{ classesSelected.remarks }}</p>
      </div>

      <img
        v-if="classesSelected.pictureUrl"
        :src="classesSelected.pictureUrl"
        class="class_picture mt-5"
      >

      <!-- <classes-members-list-table
        v-if="!classesSelectedIsLoading"
        :classId="classesSelected._id"
        @classesMembersOpenCreateDialog="classesMembersOpenCreateDialog"
      /> -->

      <!-- <div class="page-actions">
        <el-button @click="classesMembersOpenCreateDialog" type="primary">
          <i class="el-icon-plus el-icon--left"></i> Create member
        </el-button>
      </div> -->
    </el-main>

    <!-- <classes-members-create-dialog
      v-if="!classesSelectedIsLoading"
      :classId="classesSelected._id"
      :className="classesSelected.name"
      :shown.sync="classesMembersShowCreateDialog"
    /> -->
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
// import ClassesMembersListTable from "@/containers/classes/members/ClassesMembersListTable"
// import ClassesMembersCreateDialog from "@/containers/classes/members/ClassesMembersCreateDialog"

export default {
  name: "ClassesViewScreen",

  components: {
    // ClassesMembersListTable,
    // ClassesMembersCreateDialog
  },

  data: () => ({
    // classesMembersShowCreateDialog: false
  }),

  async created() {
    await this.classesSelectAsync({ _id: this.$route.params.classId })
  },

  computed: {
    ...mapState("classes", {
      classesSelectedIsLoading: "selectedIsLoading",
      classesSelected: "selected"
    })
  },

  methods: {
    ...mapActions("classes", {
      classesSelectAsync: "selectAsync"
    }),

    classesSelectedDispatchActions() {}

    // classesMembersOpenCreateDialog() {
    //   this.classesMembersShowCreateDialog = true
    // }
  }
}
</script>
