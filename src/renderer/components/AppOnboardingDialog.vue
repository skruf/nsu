<style lang="stylus">
.app-onboarding-dialog
  max-width 420px
  margin-top 15vh !important

  .el-dialog__header
    padding 2px

  .el-carousel__indicators
    bottom 15px

  .el-carousel__indicator
    .el-carousel__button
      background-color var(--primary-alt-color)
    &.is-active
      .el-carousel__button
        background-color var(--primary-color)

.onboarding-slide
  display flex
  flex-direction column
  padding 20px 30px
  height 100%

.onboarding-slide-image
  height 260px

.onboarding-slide-text
  flex 1
  display flex
  align-items center
  justify-content center
  flex-direction column
  text-align center
  padding-bottom 10px

.onboarding-slide-text-title
  margin-bottom 10px

.onboarding-slide-text-paragraph
  padding 0 5px

</style>

<template>
  <el-dialog
    custom-class="app-onboarding-dialog"
    :append-to-body="true"
    :visible.sync="visible"
    @close="close"
  >
    <el-carousel
      height="520px"
      trigger="click"
      :autoplay="false"
    >
      <el-carousel-item
        v-for="(slide, index) in slides"
        :key="index"
      >
        <div class="onboarding-slide">
          <img
            class="onboarding-slide-image"
            :src="slide.imageUrl"
          >
          <div class="onboarding-slide-text">
            <h2 class="h2 onboarding-slide-text-title">
              {{ slide.title }}
            </h2>
            <p class="paragraph onboarding-slide-text-paragraph">
              {{ slide.text }}
            </p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <template slot="footer">
      <el-button
        class="block mx-auto"
        type="primary"
      >
        Ok, let's go!
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "AppOnboardingDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      slides: [{
        title: "Slide 1",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "static/img/onboarding-slide-1.svg"
      }, {
        title: "Slide 2",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "static/img/onboarding-slide-2.svg"
      }, {
        title: "Slide 3",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "static/img/onboarding-slide-3.svg"
      }, {
        title: "Slide 4",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        imageUrl: "static/img/onboarding-slide-4.svg"
      }]
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    close() {
      this.visible = false
      this.$emit("update:shown", false)
      this.$emit("close")
    }
  }
}
</script>
