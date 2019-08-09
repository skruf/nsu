<i18n>
{
  "en": {
    "title": "Input results",
    "subtitle": "For %{event}",
    "preview": "Preview",
    "saveSuccess": "Results for %{count} participants was saved"
  },
  "no": {
    "title": "Angi resultater",
    "subtitle": "For %{event}",
    "preview": "Forhåndsvis",
    "saveSuccess": "Resultater for %{count} antall deltakere ble lagret"
  }
}
</i18n>

<style lang="stylus">
.el-dialog.events-divisions-contestants-results-create-dialog
  .hit
    max-width 40px
    width 100%
    .el-input-number
      width auto
    .el-input__inner
      padding-left 0
      padding-right 0
      text-align center
  .notes
    width 60px
    display flex
    justify-content flex-end
    .el-tag
      background-color #fff

</style>

<template>
  <el-dialog
    custom-class="events-divisions-contestants-results-create-dialog"
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

    <div class="flex min-h-full w-full">
      <events-divisions-list-menu
        @select-division="selectDivision"
        @eventsDivisionsOpenCreateDialog="eventsDivisionsOpenCreateDialog"
      />

      <div
        v-loading="contestantsIsLoading"
        class="flex-1 p-5 overflow-y-scroll"
      >
        <h5 class="h5 pb-2">
          Input results
        </h5>

        <!-- <search-form
          v-model="membersSearch"
          class="small py-2"
          :placeholder="$t('clubsMembersSearchFormPlaceholder')"
          @submit="membersSearchSubmit"
        /> -->

        <ul v-if="showEventsDivisionsContestantsList">
          <li class="flex mt-2">
            <div class="w-1/4">
              Participant
            </div>
            <div class="flex w-3/4">
              <div class="flex ml-4 mr-8 w-full">
                <div
                  v-for="(hit, index) in Array(13)"
                  :key="index"
                  class="text-center mx-1 hit"
                >
                  #{{ index + 1 }}
                </div>
              </div>

              <div class="notes">
                Notes
              </div>
            </div>
          </li>

          <li
            v-for="contestant in eventsDivisionsContestantsStateList"
            :key="contestant.id"
            class="mt-5 flex"
          >
            <div class="flex items-center w-1/4">
              <avatar
                :first-name="contestant.member.firstName"
                :last-name="contestant.member.lastName"
                size="small"
                class="mr-3"
              />

              <div>
                {{ contestant.member.firstName }} {{ contestant.member.lastName }}
                <small class="small text-xs block -mt-3">
                  ({{ contestant.weapon.class.name }}, {{ contestant.weapon.calibre }})
                </small>
              </div>
            </div>

            <el-form
              v-if="eventsDivisionsContestantsResultsForms[contestant.id]"
              :model="eventsDivisionsContestantsResultsForms[contestant.id]"
              class="flex w-3/4"
              label-position="top"
            >
              <div class="flex ml-4 mr-8 w-full">
                <el-form-item
                  v-for="(hit, index) in eventsDivisionsContestantsResultsForms[contestant.id].hits"
                  :key="index"
                  class="mx-1 mb-0 hit"
                >
                  <el-input-number
                    v-model="hit.sum"
                    :controls="false"
                    :min="0"
                    :max="10"
                    placeholder="0"
                  />
                </el-form-item>
              </div>

              <div class="notes">
                <el-tooltip
                  placement="top"
                  tabindex="-1"
                >
                  <ul slot="content">
                    notes..
                  </ul>
                  <el-tag>
                    3
                  </el-tag>
                </el-tooltip>
              </div>
            </el-form>
          </li>
        </ul>
        <div
          v-else
          class="data-placeholder"
        >
          Select a division
        </div>
      </div>
    </div>

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
        type="text"
        @click="preview"
      >
        {{ $t("preview") }}
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>

    <events-divisions-contestants-results-preview-dialog
      :results="eventsDivisionsContestantsResults"
      :shown.sync="showEventsDivisionsContestantsResultsPreviewDialog"
    />
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex"
import Avatar from "~/components/Avatar"
import EventsDivisionsListMenu from "~/containers/EventsDivisionsListMenu"
import EventsDivisionsContestantsResultsPreviewDialog from "~/components/EventsDivisionsContestantsResultsPreviewDialog"
import _cloneDeep from "lodash.clonedeep"

const eventsDivisionsContestantsResultsStub = {
  hits: Array.from(Array(13), () => ({ sum: 0 })),
  notes: ""
}

export default {
  name: "EventsDivisionsContestantsResultsCreateDialog",

  components: {
    EventsDivisionsListMenu,
    Avatar,
    EventsDivisionsContestantsResultsPreviewDialog
  },

  props: {
    shown: { type: Boolean, default: false }
  },

  data: function() {
    return {
      visible: this.shown,
      eventsDivisionsContestantsResultsForms: {},
      eventsDivisionsContestantsResults: [],
      showEventsDivisionsContestantsResultsPreviewDialog: false
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateSelected: "selected"
    }),
    ...mapState("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsStateCreateManyIsLoading: "createManyIsLoading"
    }),
    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading"
    }),
    showEventsDivisionsContestantsList() {
      return Object.keys(this.eventsDivisionsContestantsStateList).length > 0
    },
    contestantsIsLoading() {
      return (
        this.eventsDivisionsContestantsResultsStateCreateManyIsLoading ||
        this.eventsDivisionsContestantsStateListIsLoading
      )
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsCreateMany: "createMany",
      eventsDivisionsContestantsResultsActionsList: "list"
    }),
    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),
    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),

    async open() {
      if(this.showEventsDivisionsContestantsList) {
        this.createEventsDivisionsContestantsResultsForms()
      }
    },

    createEventsDivisionsContestantsResultsForms() {
      const form = {}
      this.eventsDivisionsContestantsStateList.forEach((contestant) => {
        form[contestant.id] = _cloneDeep(eventsDivisionsContestantsResultsStub)
      })
      this.eventsDivisionsContestantsResultsForms = form
    },

    selectDivision(division) {
      this.createEventsDivisionsContestantsResultsForms()
    },

    eventsDivisionsOpenCreateDialog() {
      this.$emit("eventsDivisionsOpenCreateDialog")
    },

    openEventsDivisionsContestantsResultsPreviewDialog() {
      this.showEventsDivisionsContestantsResultsPreviewDialog = true
    },

    getTotal(hits) {
      const counted = hits.sort((a, b) => b - a).slice(0, 10)
      return counted.reduce((acc, v) => acc + v)
    },

    setResults() {
      this.eventsDivisionsContestantsResults = this.eventsDivisionsContestantsStateList.map(
        (contestant) => {
          const form = this.eventsDivisionsContestantsResultsForms[contestant.id]
          const hits = form.hits.map((hit) => hit.sum)
          const total = this.getTotal(hits)

          return {
            hits,
            total,
            contestant: contestant,
            contestantId: contestant.id,
            divisionId: contestant.divisionId
          }
        }
      ).filter((contestant) => contestant.total !== 0)
    },

    preview() {
      this.setResults()
      this.openEventsDivisionsContestantsResultsPreviewDialog()
    },

    async save() {
      this.setResults()
      try {
        const { count } = await this.eventsDivisionsContestantsResultsActionsCreateMany(
          this.eventsDivisionsContestantsResults
        )

        await this.eventsDivisionsContestantsResultsActionsList()

        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            count
          })
        })
        this.close()
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
    },

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
