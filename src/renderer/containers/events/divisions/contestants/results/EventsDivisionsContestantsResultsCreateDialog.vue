<i18n>
{
  "en": {
    "title": "Input results",
    "subtitle": "For %{event}"
  },
  "no": {
    "title": "Fyll inn resultater",
    "subtitle": "For %{event}"
  }
}
</i18n>

<style lang="stylus">
.el-dialog.events-divisions-contestants-results-create-dialog
  display flex
  flex-direction column

  .selection
    box-shadow 0 0px 12px 2px rgba(223, 228, 234, .6)
    background-color #F6F9FB

  .el-dialog__body
    display flex
    flex-grow 1
    padding 0
    overflow-y auto

  .side
    min-width 250px
    width 25%

  .list_item
    padding 10px
    display flex
    align-items center
    justify-content space-between
    background-color var(--input-bg-color)
    border-radius var(--border-radius)
    font-weight var(--controller-font-weight)
    box-shadow var(--box-shadow)
    // border var(--border-width) solid var(--border-color)
    &:hover
      color var(--primary-color)
      cursor pointer
    &.is-active
      &, .h6
        color var(--primary-color)

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
        {{ $t("subtitle", { event: event.title }) }}
      </small>
    </template>

    <div
      v-loading="eventsDivisionsStateListIsLoading"
      class="flex min-h-full w-full"
    >
      <div class="side selection p-6">
        <h5 class="h5 pb-2">
          Select division
        </h5>

        <ul>
          <li
            v-for="division in eventsDivisionsStateList"
            :key="division.id"
            :class="[ 'mt-2', 'list_item', isDivisionActive(division) ]"
            @click="fetchEventsDivisionsContestantsList(division)"
          >
            <div class="w-full">
              <h6 class="h6 inline mr-2">
                {{ division.name }}
              </h6>
              {{ division.distance }}
            </div>
            <i class="el-icon-arrow-right" />
          </li>
        </ul>
      </div>

      <div
        v-loading="eventsDivisionsContestantsStateListIsLoading"
        class="flex-1 p-6 overflow-y-scroll"
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
                  #{{ index }}
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
                <el-tooltip placement="top">
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
        <template v-else>
          <small class="small placeholder">
            Select a division
          </small>
        </template>
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
        Preview
      </el-button>
      <el-button
        class="block"
        type="primary"
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
import Avatar from "@/components/Avatar"
import EventsDivisionsContestantsResultsPreviewDialog from "@/components/EventsDivisionsContestantsResultsPreviewDialog"
import _cloneDeep from "lodash.clonedeep"

const eventsDivisionsContestantsResultsStub = {
  hits: Array.from(Array(13), () => ({ sum: 0 })),
  notes: ""
}

export default {
  name: "EventsDivisionsContestantsResultsCreateDialog",

  components: {
    Avatar,
    EventsDivisionsContestantsResultsPreviewDialog
  },

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true }
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
    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsCreateManyIsLoading: "createManyIsLoading"
    }),

    ...mapState("events/divisions/contestants", {
      eventsDivisionsContestantsStateList: "list",
      eventsDivisionsContestantsStateListIsLoading: "listIsLoading"
    }),

    ...mapState("events/divisions", {
      eventsDivisionsStateListIsLoading: "listIsLoading",
      eventsDivisionsStateList: "list",
      eventsDivisionsStateSelectedIsLoading: "selectedIsLoading",
      eventsDivisionsStateSelected: "selected"
    }),

    showEventsDivisionsContestantsList() {
      return Object.keys(this.eventsDivisionsContestantsStateList).length > 0
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
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

    async fetchEventsDivisionsContestantsList(division) {
      try {
        await this.eventsDivisionsActionsSelect({ id: division.id })
        this.eventsDivisionsContestantsMutationsSetListFilter({ divisionId: division.id })
        await this.eventsDivisionsContestantsActionsList()
        this.createEventsDivisionsContestantsResultsForms()
      } catch(e) {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }
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
            eventId: contestant.divisionId
          }
        }
      ).filter((contestant) => contestant.total !== 0)
    },

    preview() {
      this.setResults()
      this.openEventsDivisionsContestantsResultsPreviewDialog()
    },

    openEventsDivisionsContestantsResultsPreviewDialog() {
      this.showEventsDivisionsContestantsResultsPreviewDialog = true
    },

    isDivisionActive(division) {
      if(
        this.eventsDivisionsStateSelected &&
        this.eventsDivisionsStateSelected.id === division.id
      ) {
        return "is-active"
      }
    },

    ...mapActions("events/divisions/contestants/results", {
      eventsDivisionsContestantsResultsActionsCreateMany: "createMany"
    }),

    ...mapMutations("events/divisions/contestants", {
      "eventsDivisionsContestantsMutationsSetListFilter": "SET_LIST_FILTER"
    }),

    ...mapActions("events/divisions/contestants", {
      eventsDivisionsContestantsActionsList: "list"
    }),

    ...mapActions("events/divisions", {
      eventsDivisionsActionsList: "list",
      eventsDivisionsActionsSelect: "select"
    }),

    close() {
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
