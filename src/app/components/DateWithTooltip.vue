<style lang="stylus">
</style>

<template>
  <el-tooltip
    v-if="date"
    placement="top"
    :content="date | moment('calendar')"
  >
    <span>{{ date | moment("DD. MMM, YYYY") }}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: "DateWithTooltip",
  props: {
    date: { type: String, required: true }
  }
}
</script>
