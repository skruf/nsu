<i18n>
{
  "en": {
    "breadcrumb1Label": "Events",
    "breadcrumb2Label": "All",
    "title": "Events",
    "eventsOpenCreateDialogButton": "Create event",
    "past": "Past",
    "upcoming": "Upcoming",
    "all": "All"
  },
  "no": {
    "breadcrumb1Label": "Stevner",
    "breadcrumb2Label": "Alle",
    "title": "Stevner",
    "eventsOpenCreateDialogButton": "Opprett stevne",
    "past": "Avsluttet",
    "upcoming": "Kommende",
    "all": "Alle"
  }
}
</i18n>

<template>
  <el-container
    id="events-list-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[{
          to: '/events',
          label: $t('breadcrumb1Label')
        }, {
          to: '',
          label: breadcrumbLabel
        }]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ breadcrumbLabel }} {{ $t("title") }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <events-list-table
        @eventsOpenCreateDialog="eventsOpenCreateDialog"
        @eventsOpenEditDialog="eventsOpenEditDialog"
      />
    </el-main>

    <el-footer height="auto">
      <el-button
        type="primary"
        @click="eventsOpenCreateDialog"
      >
        <i class="el-icon-plus el-icon--left" />
        {{ $t("eventsOpenCreateDialogButton") }}
      </el-button>
    </el-footer>

    <events-create-dialog
      :shown.sync="eventsShowCreateDialog"
    />

    <events-edit-dialog
      :shown.sync="eventsShowEditDialog"
      :item="eventsEditItem"
    />
  </el-container>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex"
import BreadcrumbBar from "~/components/BreadcrumbBar"
import EventsListTable from "~/containers/EventsListTable"
import EventsCreateDialog from "~/containers/EventsCreateDialog"
import EventsEditDialog from "~/containers/EventsEditDialog"

export default {
  name: "EventsListScreen",

  components: {
    BreadcrumbBar,
    EventsListTable,
    EventsCreateDialog,
    EventsEditDialog
  },

  data: () => ({
    eventsShowCreateDialog: false,
    eventsShowEditDialog: false,
    eventsEditItem: {}
  }),

  computed: {
    ...mapState("events", {
      eventsStateFetchMode: "fetchMode"
    }),

    breadcrumbLabel() {
      if(this.eventsStateFetchMode === "history") {
        return this.$t("past")
      }
      if(this.eventsStateFetchMode === "upcoming") {
        return this.$t("upcoming")
      }
      return "All"
    }
  },

  watch: {
    "$route.query.filter": {
      immediate: true,
      handler: async function(mode) {
        this.eventsMutationsSetFetchMode(mode)
        await this.eventsActionsList()
      }
    }
  },

  methods: {
    ...mapMutations("events", {
      eventsMutationsSetFetchMode: "SET_FETCH_MODE"
    }),

    ...mapActions("events", {
      eventsActionsList: "list"
    }),

    eventsOpenCreateDialog() {
      this.eventsShowCreateDialog = true
    },

    eventsOpenEditDialog(item) {
      this.eventsShowEditDialog = true
      this.eventsEditItem = item
    }
  }
}
</script>
