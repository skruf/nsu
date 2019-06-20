<style lang="stylus">
#app
  flex 1
  min-height 100vh
  display flex

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

</style>

<template>
  <div>
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

      <router-view />
    </el-container>
  </div>
</template>

<script lang="ts">
import AppSidebar from "~/components/AppSidebar"

export default {
  name: "Nsu",

  components: {
    AppSidebar
  },

  data: () => ({
    isSidebarOpen: true
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
    electron.ipcRenderer.send("APP_STARTED")

    if(localStorage.isSidebarOpen !== undefined) {
      this.isSidebarOpen = localStorage.isSidebarOpen === "true"
    }

    electron.ipcRenderer.on("SET_UPDATE_STATUS", (e, status) => {
      let title = "Oppdatering"
      let message

      console.log(status)

      switch(status.type) {
        case "UPDATE_CHECKING":
          message = "Ser etter oppdateringer"
          break
        case "UPDATE_AVAILABLE":
          message = "En ny oppdatering er tilgjengelig!"
          break
        case "UPDATE_NOT_AVAILABLE":
          message = "Oppdateringen var ikke tilgjengelig"
          break
        case "UPDATE_ERROR":
          message = "En feil oppstod under oppdatering"
          break
        case "UPDATE_DOWNLOADED":
          message = "Oppdateringen ble lastet ned. Installerer og restarter om 5 sekunder."
          break
      }

      this.$notify.info({ title, message })
    })
  }
}
</script>
