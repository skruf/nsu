<i18n>
{
  "en": {
    "title": "Create divisjon",
    "subtitle": "For %{event}",
    "print": "Print"
  },
  "no": {
    "title": "Opprett divisjon",
    "subtitle": "For %{event}",
    "print": "Skriv ut"
  }
}
</i18n>

<template>
  <el-dialog
    custom-class="events-divisions-print-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: "event.title" }) }}
      </small>
    </template>

    bla

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        {{ $t("close") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="print"
      >
        {{ $t("print") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "EventsDivisionsPrintDialog",

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  computed: {
    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateList: "list"
    }),
    ...mapState("events/divisions", {
      eventsDivisionsStateSelected: "selected"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    print() {
      this.$ipc.send("PRINT_WINDOW", "test")
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
