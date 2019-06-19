<style lang="stylus">
.breadcrumb-bar
  width 100%
  display flex
  align-items center
  justify-content space-between
  margin-bottom 5px
  .el-button
    padding 0
    & + .el-button
      margin-left 5px
.el-breadcrumb
  font-size 13px
  padding-left 1px
  padding-right 1px
.el-breadcrumb__inner
  text-transform capitalize
  &:hover a
    color var(--primary-color)
    cursor pointer
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link
  color #fff
  font-weight 400
.el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover
  color rgba(255, 255, 255, 0.85)
.el-breadcrumb__separator[class*=icon]
  color #fff
  margin 0 5px 0 0
.nav-buttons .el-button
  color #fff
</style>

<template>
  <div class="breadcrumb-bar">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in paths"
        :key="index"
        :to="{ path: item.to }"
      >
        {{ item.label }}
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="nav-buttons">
      <el-button
        type="text"
        icon="el-icon-printer"
        @click="print"
      />
      <el-button
        type="text"
        icon="el-icon-arrow-left"
        @click="navBack"
      />
      <el-button
        type="text"
        icon="el-icon-arrow-right"
        @click="navForward"
      />
    </div>
  </div>
</template>

<script>
import kebabcase from "~/utils/kebabcase"
import { Breadcrumb, BreadcrumbItem } from "element-ui"

export default {
  name: "BreadcrumbBar",

  components: {
    ElBreadcrumb: Breadcrumb,
    ElBreadcrumbItem: BreadcrumbItem
  },

  props: {
    paths: { type: Array, required: true }
  },

  methods: {
    print() {
      const fileName = kebabcase(this.paths[this.paths.length - 1].label)
      window.electron.ipcRenderer.send("PRINT_WINDOW", `${fileName}`)
    },
    navBack() {
      this.$router.go(-1)
    },
    navForward() {
      this.$router.go(1)
    }
  }
}
</script>
