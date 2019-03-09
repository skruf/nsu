<style lang="stylus">
.logo
  max-width 100px
  padding 14px 0
  margin-top 10px
  margin-bottom 10px
</style>

<template>
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
</template>

<script>
export default {
  name: "AppSidebar",
  methods: {
    navTo(url) {
      this.$router.push(url)
    }
  }
}
</script>
