<style lang="stylus">
</style>

<template>
  <el-container
    id="ranges-view-screen"
    v-loading="rangesStateSelectedIsLoading"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/ranges', label: 'Ranges' },
          { to: `/ranges/${rangesStateSelected.id}`, label: rangesStateSelected.name }
        ]"
      />

      <div class="page-meta">
        <div class="page-titles">
          <h1 class="h1">
            {{ rangesStateSelected.name }}
          </h1>
          <small class="small">
            <span v-if="rangesStateSelected.address">
              {{ rangesStateSelected.address }}
            </span>
            <span v-if="rangesStateSelected.area">
              , {{ rangesStateSelected.area }}
            </span>
            <span v-if="rangesStateSelected.country">
              , {{ rangesStateSelected.country }}
            </span>
          </small>
        </div>

        <div class="page-controls">
          <el-dropdown
            trigger="click"
            @command="rangesDispatchActions"
          >
            <el-button type="text">
              <i class="el-icon-arrow-down el-icon-more" />
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
      <div class="info-grid">
        <div class="info-grid_item">
          <h6 class="h6 info-grid_item_key">
            Address:
          </h6>
          <p class="info-grid_item_value">
            {{ rangesStateSelected.address }}
          </p>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { mapActions, mapState } from "vuex"
import BreadcrumbBar from "~/components/BreadcrumbBar"

export default {
  name: "RangesViewScreen",

  components: {
    BreadcrumbBar
  },

  computed: {
    ...mapState("ranges", {
      rangesStateSelectedIsLoading: "selectedIsLoading",
      rangesStateSelected: "selected"
    })
  },

  async created() {
    await this.rangesActionsSelect({ id: this.$route.params.rangeId })
  },

  methods: {
    ...mapActions("ranges", {
      rangesActionsSelect: "select"
    }),

    rangesDispatchActions() {
      this.$notify({
        type: "warning",
        title: "Oops!",
        message: "Denne funksjonen er ikke implementert enda"
      })
    }
  }
}
</script>
