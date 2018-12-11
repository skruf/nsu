<style lang="stylus">
.search-form
  display flex
  margin 10px 0 20px
  .el-button
    margin-left 20px
</style>

<template>
  <el-form ref="form" class="search-form" @submit.prevent.native="submit">
    <el-input
      v-model="v"
      @input="input"
      @clear="submit"
      :placeholder="placeholder"
      :clearable="true"
    ></el-input>

    <el-button native-type="submit" type="primary">Search</el-button>
  </el-form>
</template>

<script>
export default {
  name: "SearchForm",
  props: {
    value: { type: String, default: "" },
    placeholder: { type: String, default: "Enter search words.." }
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
