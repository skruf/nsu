<style lang="stylus">
.filter-form
  display flex
  margin 10px 0 20px
  .el-button
    margin-left 20px
</style>

<template>
  <el-form ref="form" class="filter-form" @submit.prevent.native="submit">
    <el-input v-model="v" @input="input" placeholder="Enter search words.." :clearable="true"></el-input>
    <el-button native-type="submit" type="primary">Search</el-button>
  </el-form>
</template>

<script>
export default {
  name: "FilterForm",
  prop: [ "value" ],
  data: function() {
    return {
      v: this.value
    }
  },
  methods: {
    input() {
      this.$emit("input", this.v)
    },
    submit() {
      this.$emit("submit", this.v)
    }
  }
}
</script>
