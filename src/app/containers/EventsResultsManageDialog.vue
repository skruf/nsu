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
.el-dialog.events-results-manage-dialog
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
    custom-class="events-results-manage-dialog"
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

    <div class="flex-1 p-5 overflow-y-scroll">
      <ul>
        <li class="flex">
          <div class="w-5">
            Nr
          </div>
          <div class="flex w-full">
            <div class="flex mx-8 w-full">
              <div
                v-for="(hit, index) in Array(13)"
                :key="index"
                class="text-center mx-1 hit"
              >
                #{{ index + 1 }}
              </div>
            </div>

            <!-- <div class="notes">
              Notes
            </div> -->
          </div>
        </li>

        <li
          v-for="contestant in contestants"
          :key="contestant.id"
          class="mt-5 flex"
        >
          <div class="flex items-center w-5">
            {{ contestant.participant.number }}
          </div>

          <el-form
            :model="forms[contestant.id]"
            class="flex w-full"
            label-position="top"
          >
            <div class="flex mx-8 w-full">
              <el-form-item
                v-for="form in forms[contestant.id]"
                :key="form.hit"
                class="mx-1 mb-0 hit"
              >
                <el-input-number
                  v-model="form.sum"
                  :controls="false"
                  :min="0"
                  :max="10"
                  placeholder="0"
                />
              </el-form-item>
            </div>

            <!-- <div class="notes">
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
            </div> -->
          </el-form>
        </li>
      </ul>
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
        type="primary"
        @click="save"
      >
        {{ $t("save") }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import Vue from "vue"
import { db } from "~/db"

export default Vue.extend({
  name: "EventsResultsManageDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, required: true },
    weaponClass: { type: Object, required: true }
  },

  data: function() {
    return {
      visible: this.shown,
      forms: {},
      contestants: [],
      showPreviewDialog: false,
      sub: null,
      isLoading: false
    }
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    },
    weaponClass: {
      immediate: true,
      handler: async function(c) {
        if(!c) return
        await this.setContestants()
      }
    }
  },

  methods: {
    async setContestants() {
      this.isLoading = true

      const observer = async (contestants) => {
        this.contestants = await Promise.all(
          contestants.map(
            async (contestant) => {
              contestant.participant = await contestant.participantId_

              if(contestant.total) {
                this.forms[contestant.id] = contestant.hits
              } else {
                this.forms[contestant.id] = []
                for(let i = 13; i > 0; i--) {
                  this.forms[contestant.id].push({ hit: i, sum: 0 })
                }
              }

              return contestant
            }
          )
        )

        this.isLoading = false
      }

      const errorHandler = (e) => {
        this.$notify({
          type: "error",
          title: "Oops!",
          message: e.message
        })
      }

      const weapons = await db.events_participants_weapons
        .find({ classId: this.weaponClass.id })
        .exec()

      const participantIds = weapons.map(({ participantId }) => participantId)
      this.sub = db.events_contestants
        .find({ eventId: this.event.id })
        .where("participantId")
        .in(participantIds)
        .$.subscribe(observer, errorHandler)
    },

    getTotal(hits) {
      return [ ...hits ]
        .sort((a, b) => b.sum - a.sum)
        .slice(0, 10)
        .map(({ sum }) => sum)
        .reduce((acc, v) => acc + v)
    },

    preview() {
      this.showPreviewDialog = true
    },

    async save() {
      try {
        this.isLoading = true
        const contestants = await Promise.all(
          this.contestants.map((contestant) => {
            const hits = this.forms[contestant.id]
            const total = this.getTotal(hits)
            return contestant.atomicUpdate((data) => {
              data.hits = hits
              data.total = total
              return data
            })
          })
        )
        this.isLoading = false

        this.$notify({
          type: "success",
          title: this.$t("success"),
          message: this.$t("saveSuccess", {
            count: contestants.length
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
})
</script>
