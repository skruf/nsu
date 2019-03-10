<style lang="stylus">
#error-screen
  text-align center

  .content
    justify-content center
    padding-bottom 100px

  .el-header
    align-items center

  .error_title
    margin 50px 0

  .error_image
    max-width 70px
    margin 0 auto

  .error_text
    max-width 700px
    margin 0 auto

  .el-footer
    justify-content flex-start
</style>

<template>
  <el-container
    id="error-screen"
    class="screen"
  >
    <!-- <el-header height="auto">
      <div class="page-titles">
        <h1 class="h1">
          An error occurred!
        </h1>
      </div>
    </el-header> -->

    <el-main class="content">
      <img
        class="error_image"
        src="static/img/error.svg"
      >

      <h1 class="h1 error_title">
        An error occurred!
      </h1>

      <p
        v-if="error"
        class="paragraph error_text"
      >
        {{ error }}
      </p>
    </el-main>

    <el-footer height="auto">
      <el-button
        type="text"
        @click="navBack"
      >
        <i class="el-icon-arrow-left el-icon--left" /> Try again
      </el-button>
    </el-footer>
  </el-container>
</template>

<script>
import log from "electron-log"

export default {
  name: "ErrorScreen",

  props: {
    error: { type: String, default: "" }
  },

  created() {
    log.error(this.error)
  },

  methods: {
    navBack() {
      this.$router.go(-1)
    }
  }
}
</script>
