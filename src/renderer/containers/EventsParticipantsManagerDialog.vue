<i18n>
{
  "en": {
    "title": "Manage participants",
    "subtitle": "For %{event}",
    "clubsMembersOpenCreateDialog": "Create club member"
  },
  "no": {
    "title": "Håndter deltakere",
    "subtitle": "For %{event}",
    "clubsMembersOpenCreateDialog": "Opprett klubbmedlem"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-participants-manager-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: event.title }) }}
      </small>
    </template>

    <div class="flex min-h-full w-full">
      <events-participants-manager
        :event="event"
        @clubsMembersOpenCreateDialog="clubsMembersOpenCreateDialog"
      />
    </div>

    <template slot="footer">
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
    </template>
  </el-dialog>
</template>

<script>
import EventsParticipantsManager from "@/containers/EventsParticipantsManager"

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
