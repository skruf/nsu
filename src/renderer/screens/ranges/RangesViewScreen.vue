<style lang="stylus">
</style>

<template>
  <el-container
    id="ranges-view-screen"
    v-loading="rangesSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/ranges', label: 'Ranges' },
          { to: `/ranges/${rangesSelected._id}`, label: rangesSelected.name }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ rangesSelected.name }}
          </h1>
          <small class="small">
            <span v-if="rangesSelected.address">
              {{ rangesSelected.address }}
            </span>
            <span v-if="rangesSelected.area">
              , {{ rangesSelected.area }}
            </span>
            <span v-if="rangesSelected.country">
              , {{ rangesSelected.country }}
            </span>
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="rangesSelectedDispatchActions"
          >
            <el-button type="text">
              <div class="flex items-center">
                <i class="ml-3 text-xl el-icon-arrow-down el-icon-more el-icon--left" />
              </div>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="rangesSelectedUpdate">
                <i class="el-icon-edit el-icon--left" /> Edit
              </el-dropdown-item>
              <el-dropdown-item
                class="dropdown-menu-delete"
                command="rangesSelectedRemove"
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
            Address:
          </h6>
          <p class="info-grid_item_value">
            {{ rangesSelected.address }}
          </p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "@/components/BreadcrumbBar"

export default {
  name: "RangesViewScreen",

  components: {
    BreadcrumbBar
  },

  computed: {
    ...mapState("ranges", {
      rangesSelectedIsLoading: "selectedIsLoading",
      rangesSelected: "selected"
    })
  },

  async created() {
    await this.rangesSelectAsync({ _id: this.$route.params.rangeId })
  },

  methods: {
    ...mapActions("ranges", {
      rangesSelectAsync: "selectAsync"
    }),

    rangesSelectedDispatchActions() {}
  }
}
</script>
