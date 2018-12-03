<style lang="stylus">
#app
  flex 1
  min-height 100vh
  display flex

.logo
  max-width 100px
  padding 14px 0

.el-aside
  border-right 1px solid #e6e6e6

.el-main,
.el-header
  padding 20px 30px

.el-header
  border-bottom 1px solid #e6e6e6
  display flex
  justify-content space-between
  align-items center
  height 128px !important

.el-menu
  height 100%
  border-right none
  border-top 1px solid #e6e6e6

.filter-form
  display flex
  margin 10px 0 20px
  .el-button
    margin-left 20px
.el-tabs__header
  margin-bottom 10px

.el-pagination
  margin-top 20px

.table-controls
  display flex
  justify-content space-between
.table-controls-actions.disabled
  opacity 0.5
  pointer-events none
  cursor no-drop

.el-table
  &, thead
    font inherit
    color inherit

.table-clickable
  .el-table__row
    cursor pointer

.el-dropdown
  font-size 17px

.breadcrumb-bar
  padding 15px 30px
  border-bottom 1px solid #e6e6e6
.el-breadcrumb
  font-size 13px
.el-breadcrumb__inner:hover
  color blue
  cursor pointer

.dropdown-menu-delete
  color red

i.menu-icon
  font-size 23px
  margin-right 10px
  color #000

.el-submenu
  .el-menu-item
    padding-left 50px !important
    line-height 35px
    height 35px
    &:last-of-type
      margin-bottom 10px

h1, h2, h3
  color #000

h3
  font-size inherit
  font-weight 600

.el-tabs__nav-wrap::after
  height 1px
  background-color #e6e6e6

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
            <!-- <i class="menu-icon ion-ios-locate"></i> -->
            <span>Events</span>
          </template>
          <el-menu-item index="1-1" @click="navTo('/events')">Upcoming</el-menu-item>
          <el-menu-item index="1-2">History</el-menu-item>
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
