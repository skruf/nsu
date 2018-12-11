<style lang="stylus">
</style>

<template>
  <el-pagination
    layout="total, sizes, prev, pager, next"
    @size-change="sizeChange"
    @current-change="currentChange"
    :page-size="pageSize"
    :current-page="currentPage"
    :page-sizes="[ 15, 30, 45, 60 ]"
    :total="5"
  ></el-pagination>
</template>

<script>
// import { mapGetters, mapActions } from "vuex"
import store from "./store"

export default {
  name: "Pagination",
  props: {
    storePath: { type: String, required: true }
  },
  data: () => ({
    storeName: ""
  }),
  created() {
    this.storeName = `${this.storePath}/pagination`
    const paths = this.storePath.split("/")
    const paginationPath = [ ...paths, "pagination" ]
    const rootStore = this.$store

    console.log(this.storeName)
    console.log(paginationPath)
    console.log(rootStore)

    if(!(rootStore && rootStore.state && rootStore.state[paths[0]])) {
      rootStore.registerModule(paginationPath, store) // (paths[0], rootStore)
    } else {
      console.log(`reusing module: ${this.storeName}`)
    }
  },
  computed: {
    pageSize() {
      return 15
    },
    currentPage() {
      return 0
    }
  },
  methods: {
    sizeChange() {},
    currentChange() {}
  }
}
</script>
