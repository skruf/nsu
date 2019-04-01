<style lang="stylus">
.page-info
  display flex
  margin-left 1rem
  overflow-x hidden
  .page-info_item
    margin-left 2rem
    overflow-x hidden
    // flex 1
  .small, .h5
    white-space nowrap
    text-overflow ellipsis
    overflow-x hidden
  .small
    opacity 0.85
    font-size 13px
  .h5
    font-size 15px
    font-weight 400
    margin-bottom -5px
</style>

<template>
  <div class="page-info">
    <div
      v-for="(slot, index) in slots"
      :key="index"
      class="page-info_item"
    >
      <h5 class="h5">
        <slot :name="slot" />
      </h5>
      <small class="small">
        {{ slot }}
      </small>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageInfo",

  data: () => ({
    slots: []
  }),

  created() {
    this.slots = Object.keys(this.$slots)
  }
}
</script>
