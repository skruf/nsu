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
  // &:before
  //   content ""
  //   height 4px
  //   width 100%
  //   background-image var(--accent-border)
  //   position absolute
  //   top 0
  //   left 0
  //   right 0
  //   z-index 1

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
  background-color #ffca66
  color #000000
  .el-alert__title
    font-size 12px
    font-weight 400
    color inherit
  .el-alert__closebtn
    top 6px
    font-size 14px
    color inherit
.el-alert--warning .el-alert__description
  color inherit

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
      :class="{
        'sidebar-open': isSidebarOpen
      }"
    >
      <div class="titlebar" />

      <app-sidebar
        :open.sync="isSidebarOpen"
      />

      <!-- <app-onboarding-dialog
        :shown.sync="appOnboardingShowDialog"
      /> -->

      <router-view />
    </el-container>
  </div>
</template>

<script lang="ts">
// import AppOnboardingDialog from "~/components/AppOnboardingDialog"
import AppSidebar from "~/components/AppSidebar"

export default {
  name: "Nsu",

  components: {
    // AppOnboardingDialog,
    AppSidebar
  },

  data: () => ({
    isSidebarOpen: true
    // appOnboardingShowDialog: true
  }),

  watch: {
    isSidebarOpen() {
      localStorage.setItem("isSidebarOpen", this.isSidebarOpen)
    },
    appOnboardingShowDialog() {
      localStorage.setItem("appOnboardingShowDialog", this.appOnboardingShowDialog)
    }
  },

  created() {
    // this.$electron.ipcRenderer.send("APP_STARTED")

    if(localStorage.isSidebarOpen !== undefined) {
      this.isSidebarOpen = localStorage.isSidebarOpen === "true"
    }
    if(localStorage.appOnboardingShowDialog !== undefined) {
      this.appOnboardingShowDialog = localStorage.appOnboardingShowDialog === "true"
    }

    // this.$electron.ipcRenderer.on("SET_UPDATE_STATUS", (e, status) => {
    //   let title = "Update"
    //   let message
    //
    //   switch(status) {
    //     case "UPDATE_CHECKING":
    //       message = "Checking for updates"
    //       break
    //     case "UPDATE_AVAILABLE":
    //       message = "A new update is available!"
    //       break
    //     case "UPDATE_NOT_AVAILABLE":
    //       message = "Update not available"
    //       break
    //     case "UPDATE_ERROR":
    //       message = "An error occurred while attempting to update"
    //       break
    //     case "UPDATE_DOWNLOADED":
    //       message = "Update was successfully downloaded"
    //       break
    //   }
    //
    //   this.$notify.info({ title, message })
    // })
  }
}
</script>
