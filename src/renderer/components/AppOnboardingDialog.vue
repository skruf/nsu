<style lang="stylus">
.app-onboarding-dialog
  max-width 420px
  margin-top 15vh !important

  .el-dialog__header
    padding 2px

  .el-carousel__indicators
    bottom 5px

  .el-carousel__indicator
    .el-carousel__button
      background-color var(--primary-alt-color)
    &.is-active
      .el-carousel__button
        background-color var(--primary-color)

.onboarding-slide
  display flex
  flex-direction column
  padding 20px
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
  // padding-bottom 10px

.onboarding-slide-text-title
  margin-bottom 20px
  line-height 1.25

.onboarding-slide-text-paragraph
  padding 0 10px
  line-height 1.75

</style>

<template>
  <el-dialog
    custom-class="app-onboarding-dialog"
    :append-to-body="true"
    :visible.sync="visible"
    @close="close"
  >
    <el-carousel
      height="560px"
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
        @click="close"
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
        title: "Welcome to NSUs Event Management app!",
        text: "This application is the result of a join effort between NSU and the creators, where the goal is to effectivize workflows for managing shooting competitions inside an organization.",
        imageUrl: "static/img/onboarding-slide-1.svg"
      }, {
        title: "Manage clubs & their members",
        text: "Easily keep track of and manage clubs and their member's participation in events. Later additions of this app will include statistics over the most active participants and their results.",
        imageUrl: "static/img/onboarding-slide-2.svg"
      }, {
        title: "Stay up to date on weapon class rules",
        text: "Rules are important to any competitions, but can sometimes be hard to manage. We have implemented functions for easily keeping track of rules for each weapon class.",
        imageUrl: "static/img/onboarding-slide-3.svg"
      }, {
        title: "Great, now how do I get started?",
        text: "Before you get started with event creation, we recommend that you populate the required clubs and shooting ranges tables first. These items are required in order to create new events.",
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
