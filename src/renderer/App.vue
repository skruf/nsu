<i18n>
{
  "en": {
    "appWarning": "This is a preview of the software and therefore errors might occur."
  },
  "no": {
    "appWarning": "Dette er en forhåndsvisning av programvaren og feil kan derfor oppstå."
  }
}
</i18n>

<style lang="stylus">
#app
  flex 1
  min-height 100vh
  display flex
  &:before
    content ""
    height 4px
    width 100%
    background-image var(--accent-border)
    position absolute
    top 0
    left 0
    right 0
    z-index 1
    // border-top-left-radius 3px
    // border-top-right-radius 3px

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
  z-index 1
  height 25px
  padding 0
  border-radius 0
  margin-bottom -25px
  .el-alert__title
    font-size 12px
    font-weight 400
  .el-alert__closebtn
    top 6px
    font-size 14px

// #app
//   padding-top 25px

</style>

<template>
  <div>
    <!-- <el-alert
      class="app-warning"
      type="warning"
      :title="$t('appWarning')"
      :closable="false"
      center
    /> -->

    <el-container
      id="app"
      :class="{ 'sidebar-open': isSidebarOpen }"
    >
      <div class="titlebar" />

      <app-sidebar
        :open.sync="isSidebarOpen"
      />

      <app-onboarding-dialog
        :shown.sync="appOnboardingShowDialog"
      />

      <router-view />
    </el-container>
  </div>
</template>

<script>
import AppOnboardingDialog from "@/components/AppOnboardingDialog"
import AppSidebar from "@/components/AppSidebar"

export default {
  name: "Nsu",

  components: {
    AppOnboardingDialog,
    AppSidebar
  },

  data: () => ({
    isSidebarOpen: true,
    appOnboardingShowDialog: false // true
  }),

  watch: {
    isSidebarOpen() {
      localStorage.setItem("isSidebarOpen", this.isSidebarOpen)
    },
    appOnboardingShowDialog() {
      localStorage.setItem("appOnboardingHideDialog", this.appOnboardingShowDialog)
    }
  },

  created() {
    this.isSidebarOpen = localStorage.getItem("isSidebarOpen") === "true"
    // this.appOnboardingShowDialog = !localStorage.getItem("appOnboardingHideDialog") === "true"
    this.$ipc.send("APP_STARTED")
    this.$ipc.on("APP_NOTIFICATION", (event, message) => {
      this.$notify.info({ title: "Notification", message: message })
    })
  }
}
</script>
