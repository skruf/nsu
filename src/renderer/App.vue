<style lang="stylus">
#app
  flex 1
  min-height 100vh
  display flex
  padding-left 180px
  &.sidebar-open
    padding-left 64px
    i.menu-icon
      margin-right 0
    .app_aside
      width 64px !important
    .logo
      max-width 40px
    .el-menu
      padding-left 0
      text-align center

.app_aside
  width 180px !important
  display flex
  flex-direction column
  position absolute
  left 0
  top 0
  bottom 0
  background-color var(--bg-alt-color)

.el-button.collapse-button
  position fixed
  bottom 0
  left 0
  right 0
  border none
  background-color transparent
  box-shadow none
  &, &:active
    top auto
  i.menu-icon
    margin-right 0

.el-menu.el-menu--popup
  background-color var(--bg-color)

.logo
  max-width 84px
  padding 14px 0
  margin-top 25px
  margin-bottom 10px

.titlebar
  -webkit-user-select none
  -webkit-app-region drag
  width 100%
  height 20px
  position absolute
  left 0
  right 0
  top 0

.app-warning
  position absolute
  top 0
  left 0
  right 0
  height 25px
  z-index 1
  padding 0
  border-radius 0
  .el-alert__title
    font-size 12px
    font-weight 400
  .el-alert__closebtn
    top 6px
    font-size 14px
#app
  padding-top 25px

</style>

<template>
  <el-container
    id="app"
    :class="{ 'sidebar-open': isSidebarOpen }"
  >
    <el-alert
      class="app-warning"
      title="Dette er en forhåndsvisning av programvaren og feil kan derfor oppstå."
      type="warning"
      center
    />

    <div class="titlebar" />

    <el-aside
      width="auto"
      class="app_aside"
    >
      <img
        class="logo mx-auto block"
        src="https://norsksvartkruttunion.no/test/wp-content/uploads/2014/03/nsu-logo-full.png"
      >

      <el-menu
        default-active="1-1"
        :collapse="isSidebarOpen"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="menu-icon ion-logo-ionic" />
            <span>Events</span>
          </template>
          <el-menu-item
            index="1-1"
            @click="navTo('/events')"
          >
            All
          </el-menu-item>
          <el-menu-item
            index="1-2"
            @click="navTo('/events?filter=upcoming')"
          >
            Upcoming
          </el-menu-item>
          <el-menu-item
            index="1-3"
            @click="navTo('/events?filter=history')"
          >
            History
          </el-menu-item>
          <el-menu-item
            index="1-4"
            disabled
            @click="navTo('/events/categories')"
          >
            Categories
          </el-menu-item>
        </el-submenu>

        <el-menu-item
          index="2"
          @click="navTo('/classes')"
        >
          <i class="menu-icon ion-ios-nuclear" />
          <span>Classes</span>
        </el-menu-item>

        <el-menu-item
          index="3"
          @click="navTo('/clubs')"
        >
          <i class="menu-icon ion-ios-people" />
          <span>Clubs</span>
        </el-menu-item>

        <el-menu-item
          index="4"
          @click="navTo('/ranges')"
        >
          <i class="menu-icon ion-ios-people" />
          <span>Ranges</span>
        </el-menu-item>

        <el-menu-item
          index="5"
          disabled
          @click="navTo('/records')"
        >
          <i class="menu-icon ion-ios-star" />
          <span>Records</span>
        </el-menu-item>

        <el-menu-item
          index="6"
          disabled
          @click="navTo('/settings')"
        >
          <i class="menu-icon ion-ios-settings" />
          <span>Settings</span>
        </el-menu-item>
      </el-menu>

      <el-button
        class="button--text collapse-button"
        @click="toggleSidebarOpen"
      >
        <i
          v-if="isSidebarOpen"
          class="menu-icon ion-ios-expand"
        />
        <i
          v-else
          class="menu-icon ion-ios-contract"
        />
      </el-button>
    </el-aside>

    <app-onboarding-dialog
      :shown.sync="appOnboardingShowDialog"
      @close="appOnboardingHideDialog"
    />

    <router-view />
  </el-container>
</template>

<script>
import AppOnboardingDialog from "@/components/AppOnboardingDialog"

export default {
  name: "Nsu",

  components: {
    AppOnboardingDialog
  },

  data: () => ({
    isSidebarOpen: true,
    appOnboardingShowDialog: true
  }),

  created() {
    this.isSidebarOpen = localStorage.getItem("isSidebarOpen") === "true"
    // this.appOnboardingShowDialog = !localStorage.getItem("appOnboardingHideDialog") === "true"
  },

  methods: {
    toggleSidebarOpen() {
      this.isSidebarOpen = !this.isSidebarOpen
      localStorage.setItem("isSidebarOpen", this.isSidebarOpen)
    },

    navTo(url) {
      this.$router.push(url)
    },

    appOnboardingHideDialog() {
      this.appOnboardingShowDialog = false
      localStorage.setItem("appOnboardingHideDialog", this.appOnboardingShowDialog)
    }
  }
}
</script>
