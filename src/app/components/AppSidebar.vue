<i18n>
{
  "en": {
    "events": "Events",
    "all": "All",
    "upcoming": "Upcoming",
    "history": "History",
    "categories": "Categories",
    "clubs": "Clubs",
    "classes": "Classes",
    "ranges": "Ranges",
    "records": "Records",
    "settings": "Settings"
  },
  "no": {
    "events": "Stevner",
    "all": "Alle",
    "upcoming": "Kommende",
    "history": "Avsluttet",
    "categories": "Kategorier",
    "clubs": "Klubber",
    "classes": "Klasser",
    "ranges": "Skyttebaner",
    "records": "Rekorder",
    "settings": "Innstillinger"
  }
}
</i18n>

<style lang="stylus">
#app
  padding-left 180px
  &.sidebar-open
    padding-left 64px
    i.menu-icon
      margin-right 0
    .app_aside
      width 64px !important
    .logo
      max-width 40px
    .el-menu
      padding-left 0
      text-align center
    .el-menu-item,
    .el-submenu__title
      margin-bottom 10px
    .menu-img
      width 100%
      margin-right 0

.el-submenu .el-menu-item
  padding-left 56px !important
  font-size 13px

.menu-img
  width 23px
  margin-right 8px
  filter invert(.5) sepia(1) saturate(200) hue-rotate(380deg)

.logo
  max-width 84px
  padding 14px 0
  margin-top 25px
  margin-bottom 10px

.el-button.collapse-button
  position fixed
  bottom 0
  left 0
  right 0
  border none
  background-color transparent
  box-shadow none
  &, &:active
    top auto
  i.menu-icon
    margin-right 0

.el-menu.el-menu--popup
  background-color var(--bg-color)

.app_aside
  width 180px !important
  display flex
  flex-direction column
  position absolute
  left 0
  top 0
  bottom 0
  background-color var(--bg-alt-color)
  box-shadow var(--box-shadow)

</style>

<template>
  <el-aside
    width="auto"
    class="app_aside"
  >
    <img
      class="logo mx-auto block"
      src="../../../static/img/nsu-logo.png"
    >

    <el-menu
      default-active="1-1"
      :collapse="isOpen"
    >
      <el-submenu index="1">
        <template slot="title">
          <img
            class="menu-img"
            src="../../../static/img/event-icon.svg"
          >
          <span>{{ $t("events") }}</span>
        </template>
        <el-menu-item
          index="1-1"
          @click="navTo('/events')"
        >
          {{ $t("all") }}
        </el-menu-item>
        <el-menu-item
          index="1-2"
          @click="navTo('/events?filter=upcoming')"
        >
          {{ $t("upcoming") }}
        </el-menu-item>
        <el-menu-item
          index="1-3"
          @click="navTo('/events?filter=history')"
        >
          {{ $t("history") }}
        </el-menu-item>
        <el-menu-item
          index="1-4"
          @click="navTo('/events/categories')"
        >
          {{ $t("categories") }}
        </el-menu-item>
      </el-submenu>

      <el-menu-item
        index="2"
        @click="navTo('/clubs')"
      >
        <img
          class="menu-img"
          src="../../../static/img/club-icon.svg"
        >
        <span>{{ $t("clubs") }}</span>
      </el-menu-item>

      <el-menu-item
        index="3"
        @click="navTo('/classes')"
      >
        <img
          class="menu-img"
          src="../../../static/img/class-icon.svg"
        >
        <span>{{ $t("classes") }}</span>
      </el-menu-item>

      <el-menu-item
        index="4"
        @click="navTo('/ranges')"
      >
        <img
          class="menu-img"
          src="../../../static/img/range-icon.svg"
        >
        <span>{{ $t("ranges") }}</span>
      </el-menu-item>

      <el-menu-item
        index="5"
        disabled
        @click="navTo('/records')"
      >
        <img
          class="menu-img"
          src="../../../static/img/record-icon.svg"
        >
        <span>{{ $t("records") }}</span>
      </el-menu-item>

      <el-menu-item
        index="6"
        @click="navTo('/settings')"
      >
        <img
          class="menu-img"
          src="../../../static/img/settings-icon.svg"
        >
        <span>{{ $t("settings") }}</span>
      </el-menu-item>
    </el-menu>

    <el-button
      class="button--text collapse-button"
      @click="toggle"
    >
      <i
        v-if="isOpen"
        class="menu-icon el-icon-arrow-right"
      />
      <i
        v-else
        class="menu-icon el-icon-arrow-left"
      />
    </el-button>
  </el-aside>
</template>

<script>
export default {
  name: "AppSidebar",

  props: {
    open: { type: Boolean, default: true }
  },

  data: function() {
    return {
      isOpen: this.open
    }
  },

  watch: {
    open(open) {
      this.isOpen = open
      this.$emit("update:open", open)
    }
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen
      this.$emit("update:open", this.isOpen)
    },

    navTo(url) {
      this.$router.push(url)
    }
  }
}
</script>
