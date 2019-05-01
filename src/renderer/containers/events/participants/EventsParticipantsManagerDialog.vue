<i18n>
{
  "en": {
    "title": "Manage participants for %{event}",
    "clubsMembersOpenCreateDialog": "Create club member"
  },
  "no": {
    "title": "Håndter deltakere for %{event}",
    "clubsMembersOpenCreateDialog": "Opprett klubbmedlem"
  }
}
</i18n>

<style lang="stylus">
.el-dialog.events-participants-manager-dialog
  display flex
  flex-direction column
  width 800px

  .el-tabs,
  .el-tabs__content,
  .el-dialog__body
    display flex

  .el-dialog__body
    flex-grow 1
    padding 0
    max-height 75vh

</style>

<template>
  <el-dialog
    custom-class="events-participants-manager-dialog"
    :title="$t('title', { event: event.title })"
    :fullscreen="false"
    :visible.sync="visible"
    @close="close"
  >
    <div class="flex min-h-full w-full">
      <events-participants-manager
        :event="event"
        @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
      />
    </div>

    <template slot="footer">
      <!-- <div class="flex justify-between w-full"> -->
      <el-button
        class="block"
        type="text"
        @click="clubsMembersOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" />
        {{ $t("clubsMembersOpenCreateDialog") }}
      </el-button>
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("close") }}
      </el-button>
      <!-- </div> -->
    </template>
  </el-dialog>
</template>

<script>
import EventsParticipantsManager from "@/containers/events/participants/EventsParticipantsManager"

export default {
  name: "EventsParticipantsManagerDialog",

  components: {
    EventsParticipantsManager
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown
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
    },
    clubsMembersOpenCreateDialog() {
      this.$emit("clubsMembersOpenCreateDialog")
    }
  }
}
</script>
