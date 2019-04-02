<style lang="stylus">
.page-subtitles_part:not(:last-child):after
  content "•"
  margin-right .25rem
</style>

<template>
  <small class="small page-subtitles">
    <span
      v-for="(slot, index) in slots"
      :key="index"
      class="page-subtitles_part"
    >
      <slot :name="slot" />
    </span>
  </small>
</template>

<script>
export default {
  name: "PageSubtitles",

  data: () => ({
    slots: []
  }),

  created() {
    this.slots = Object.keys(this.$slots)
  }
}
</script>
