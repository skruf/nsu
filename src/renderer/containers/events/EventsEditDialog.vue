<style lang="stylus">
.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-select
  width 100%
.el-range-editor .el-range-input
  width 50%
</style>

<template>
  <el-dialog
    title="Edit an event"
    custom-class="edit-dialog"
    :visible.sync="visible"
    @open="open"
    @close="close"
  >
    <div
      v-loading="eventsStateEditIsLoading"
      class="dialog_content"
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <el-form-item
          label="Title"
          prop="title"
        >
          <el-input
            v-model="form.title"
            placeholder="Enter a title"
          />
        </el-form-item>

        <el-form-item
          label="Start / End"
          prop="dates"
        >
          <el-date-picker
            v-model="form.dates"
            type="daterange"
            range-separator="to"
            start-placeholder="Start date"
            end-placeholder="End date"
          />
        </el-form-item>

        <el-form-item
          label="Category"
          prop="category"
        >
          <el-select
            v-model="form.category"
            placeholder="Select a category"
          >
            <el-option
              v-for="(category, index) in eventsStateCategories"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Organizer"
          prop="organizerId"
        >
          <el-select
            v-model="form.organizerId"
            placeholder="Select the organizer"
            :loading="clubsStateListIsLoading"
          >
            <el-option
              v-for="club in clubsStateList"
              :key="club.id"
              :label="`${club.name} (${club.area})`"
              :value="club.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Range"
          prop="rangeId"
        >
          <el-select
            v-model="form.rangeId"
            placeholder="Select the range"
            :loading="rangesStateListIsLoading"
          >
            <el-option
              v-for="range in rangesStateList"
              :key="range.id"
              :label="`${range.name} (${range.area})`"
              :value="range.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="Approbated"
          prop="approbated"
        >
          <el-switch
            v-model="form.approbated"
            active-text="Is officially approbated?"
          />
        </el-form-item>
      </el-form>
    </div>

    <template slot="footer">
      <el-button
        class="block"
        type="text"
        @click="close"
      >
        Cancel
      </el-button>
      <el-button
        class="block"
        type="primary"
        @click="submit"
      >
        Save
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex"
import { eventsStub } from "@/stubs"

export default {
  name: "EventsEditDialog",

  props: {
    shown: { type: Boolean, default: false },
    event: { type: Object, default: () => ({ ...eventsStub, dates: [] }) }
  },

  data: function() {
    return {
      visible: this.shown,
      form: { ...eventsStub, dates: [] },
      formRules: {
        title: { required: true, message: "Title is a required field" },
        dates: { required: true, message: "Dates is a required field" },
        category: { required: true, message: "Category is a required field" },
        organizerId: { required: true, message: "Organizer is a required field" },
        rangeId: { required: true, message: "Range is a required field" }
      }
    }
  },

  computed: {
    ...mapState("events", {
      eventsStateEditIsLoading: "editIsLoading",
      eventsStateCategories: "categories"
    }),

    ...mapState("clubs", {
      clubsStateListIsLoading: "editIsLoading",
      clubsStateList: "list"
    }),

    ...mapState("ranges", {
      rangesStateListIsLoading: "listIsLoading",
      rangesStateList: "list"
    })
  },

  watch: {
    shown(shown) {
      this.visible = shown
      this.$emit("update:shown", shown)
    }
  },

  methods: {
    async open() {
      this.form = {
        ...this.event,
        dates: [
          this.event.startsAt,
          this.event.endsAt
        ]
      }
      await this.clubsActionsList()
      await this.rangesActionsList()
    },

    ...mapActions("events", {
      eventsActionsEditOne: "editOne"
    }),

    ...mapActions("clubs", {
      clubsActionsList: "list"
    }),

    ...mapActions("ranges", {
      rangesActionsList: "list"
    }),

    submit() {
      this.$refs.form.validate(async (isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: "Please fill in all required fields before saving"
          })
        }

        const data = { ...this.form }
        data.startsAt = data.dates[0].toISOString()
        data.endsAt = data.dates[1].toISOString()
        delete data.dates

        try {
          await this.eventsActionsEditOne(data)
          this.$notify({
            type: "success",
            title: "Great success",
            message: `${data.title} was successfully added to the database`
          })
          this.close()
        } catch(e) {
          this.$notify({
            type: "error",
            title: "Oops!",
            message: e.message
          })
        }
      })
    },

    clear() {
      this.form = { ...eventsStub, dates: [] }
    },

    close() {
      this.clear()
      this.visible = false
      this.$emit("update:shown", false)
    }
  }
}
</script>
