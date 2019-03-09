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
  // padding-bottom 10px

.onboarding-slide-text-title
  margin-bottom 20px

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
        title: "Et hjem for våpenklasser og skytteregler.",
        text: "Her finner dere oversikt over alle stevner som er gjennomført eller planlagt. Når dere har lagt inn den nødvendige informasjonen vil stevnet være opprettet.",
        imageUrl: "static/img/onboarding-slide-1.svg"
      }, {
        title: "Administrer klubber og tilhørende medlemmer.",
        text: "Dere kan i tillegg administrere ved å trykke på de 3 dottene på høyre side for klassen kan dere velge å fjerne klassen dersom denne ikke er aktuell lenger.",
        imageUrl: "static/img/onboarding-slide-2.svg"
      }, {
        title: "Add Clubs & Members",
        text: "Ved å trykke på et klubbnavn i listen vil dere kunne administrere denne klubben og de tilhørende medlemmene. Når dere er inne på den respektive.",
        imageUrl: "static/img/onboarding-slide-3.svg"
      }, {
        title: "Register Shooting Ranges",
        text: "Dette området brukes for å administrere og opprette baner. Trykk på «create range» for å legge til baner. Eller bruk 3 dottene på høyre hastahag was.",
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
