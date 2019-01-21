<style lang="stylus">
.el-dialog.events-participants-manager-dialog
  display flex
  flex-direction column
  position fixed
  left 5%
  top 5%
  right 5%
  bottom 5%
  height 90%
  width 90%

  .events-participants-manager
    padding-top 0
  .content
    margin-top 0
    margin-bottom 0

  .el-tabs,
  .el-tabs__content,
  .el-dialog__body
    display flex

  .el-dialog__body
    flex-grow 1
    padding 0

</style>

<template>
  <el-dialog
    :title="`Manage participants for ${event.title}`"
    custom-class="events-participants-manager-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @close="close"
  >
    <div class="flex min-h-full w-full">
      <events-participants-manager :event="event" />
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        Close
      </el-button>
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
    }
  }
}
</script>
