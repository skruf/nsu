<style lang="stylus">
#app
  flex 1
  min-height 100vh
  display flex

.logo
  max-width 100px
  padding 14px 0

</style>

<template>
  <el-container id="app">

    <el-aside width="175px">
      <img
        class="logo mx-auto block"
        src="https://norsksvartkruttunion.no/test/wp-content/uploads/2014/03/nsu-logo-full.png"
      >

      <el-menu default-active="1-1">
        <el-submenu index="1">
          <template slot="title">
            <i class="menu-icon ion-logo-ionic"></i>
            <span>Events</span>
          </template>
          <el-menu-item index="1-1" @click="navTo('/events')">All</el-menu-item>
          <el-menu-item index="1-2" @click="navTo('/events?filter=upcoming')">Upcoming</el-menu-item>
          <el-menu-item index="1-3" @click="navTo('/events?filter=history')">History</el-menu-item>
        </el-submenu>
        <el-menu-item index="2">
          <i class="menu-icon ion-ios-people"></i>
          <span>Clubs</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="menu-icon ion-ios-star"></i>
          <span>Records</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="menu-icon ion-ios-nuclear"></i>
          <span>Armory</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <router-view></router-view>

  </el-container>
</template>

<script>
export default {
  name: "nsu",
  methods: {
    navTo(url) {
      this.$router.push(url)
    }
  }
}
</script>
