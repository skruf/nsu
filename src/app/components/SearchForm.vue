<style lang="stylus">
.search-form
  display flex
  width 100%
  max-width 400px
  .el-input__inner
    height 42px
    line-height 42px
  .el-button
    margin-left 20px
  .el-input__icon
    font-size 18px
  &.small
    .el-input__icon,
    .el-input__inner
      line-height 30px
      font-size 16px
    .el-input__inner
      height 30px
    .el-button
      padding 0 10px
    .el-input, .el-button, .el-input__inner, .el-tabs__item
      font-size 0.8rem
</style>

<template>
  <el-form
    ref="form"
    class="search-form"
    :disabled="disabled"
    @submit.prevent.native="submit"
  >
    <el-input
      v-model="v"
      :placeholder="placeholder"
      :clearable="true"
      prefix-icon="el-icon-search"
      @input="input"
      @clear="submit"
    />
  </el-form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Enter search words.." },
    disabled: { type: Boolean, default: false }
  },
  data: function() {
    return {
      v: this.value
    }
  },
  methods: {
    input() {
      this.$emit("input", this.v)
      if(this.v === "") {
        this.submit()
      }
    },
    submit() {
      this.$emit("submit", this.v)
    }
  }
}
</script>
