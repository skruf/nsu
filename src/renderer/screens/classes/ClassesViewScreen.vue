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
  <el-container
    id="classes-view-screen"
    v-loading="classesStateSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/classes', label: 'Classes' },
          { to: `/classes/${classesStateSelected.id}`, label: classesStateSelected.name }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles -mb-1">
          <h1 class="h1 mb-1">
            {{ classesStateSelected.name }}
          </h1>
          <small class="small">
            # {{ classesStateSelected.number }}
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="classesDispatchActions"
          >
            <el-button type="text">
              <div class="flex items-center">
                <i class="ml-3 text-xl el-icon-arrow-down el-icon-more el-icon--left" />
              </div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="">
                <i class="el-icon-edit el-icon--left" /> Edit
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-menu-delete"
                command=""
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
      <div class="info-grid content">
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            category:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.category }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            condition:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.condition }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            target:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.target }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            position:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.position }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            distance:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.distance }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            type:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.type }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            sight:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.sight }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            trigger:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.trigger }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            calibre:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.calibre }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            bulletType:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.bulletType }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            loadingRod:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.loadingRod }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            cleaning:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.cleaning }}
          </p>
        </div>

        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            team:
          </h6>
          <p class="info-grid_item_value">
            {{ classesStateSelected.team }}
          </p>
        </div>
      </div>

      <div
        class="content"
        style="calc(100% - 50px)"
      >
        <div
          v-if="classesStateSelected.remarks"
          class="class_remarks"
        >
          <h6 class="h6">
            Remarks:
          </h6>
          <p class="p mt-5">
            {{ classesStateSelected.remarks }}
          </p>
        </div>

        <img
          v-if="classesStateSelected.pictureUrl"
          :src="classesStateSelected.pictureUrl"
          class="class_picture mt-10"
        >
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"

export default {
  name: "ClassesViewScreen",

  components: { BreadcrumbBar },

  computed: {
    ...mapState("classes", {
      classesStateSelectedIsLoading: "selectedIsLoading",
      classesStateSelected: "selected"
    })
  },

  async created() {
    await this.classesActionsSelect({ id: this.$route.params.classId })
  },

  methods: {
    ...mapActions("classes", {
      classesActionsSelect: "select"
    }),

    classesDispatchActions() {}
  }
}
</script>
