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
    custom-class="events-startlist-print-dialog"
    :fullscreen="true"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <template slot="title">
      <h3 class="h3">
        {{ $t("title") }}
      </h3>
      <small class="small">
        {{ $t("subtitle", { event: eventsStateSelected.title }) }}
      </small>
    </template>

    startlistprint

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
  name: "EventsStartlistPrintDialog",

  props: {
    shown: { type: Boolean, default: false },
    data: { type: Array, required: true }
  },

  data: function() {
    return {
      visible: this.shown
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    open() {
      console.log(this.data)
    },
    print() {
      this.$electron.ipcRenderer.send("PRINT_WINDOW", "test")
    },
    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
