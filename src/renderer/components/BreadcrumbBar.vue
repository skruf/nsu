<style lang="stylus">
.breadcrumb-bar
  margin-bottom 15px
  width 100%
  display flex
  align-items center
  justify-content space-between
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
  &:hover
    color var(--primary-color)
    cursor pointer
.el-breadcrumb__separator
  color var(--text-color)
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

    <div>
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
    navBack() {
      this.$router.go(-1)
    },
    navForward() {
      this.$router.go(1)
    }
  }
}
</script>
