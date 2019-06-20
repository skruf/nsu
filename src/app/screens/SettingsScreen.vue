<i18n>
{
  "en": {
    "title": "Your current settings",
    "breadcrumbLabel1": "Settings",
    "breadcrumbLabel2": "Current",
    "formItem1Label": "Language",
    "formItem1Placeholder": "Choose language"
  },
  "no": {
    "title": "Dine innstillinger",
    "breadcrumbLabel1": "Innstillinger",
    "breadcrumbLabel2": "Nåværende",
    "formItem1Label": "Språk",
    "formItem1Placeholder": "Velg språk"
  }
}
</i18n>

<template>
  <el-container
    id="settings-screen"
    class="screen"
  >
    <el-header height="auto">
      <breadcrumb-bar
        :paths="[
          { to: '/settings', label: $t('breadcrumbLabel1') },
          { to: '', label: $t('breadcrumbLabel2') }
        ]"
      />

      <div class="page-titles">
        <h1 class="h1">
          {{ $t("title") }}
        </h1>
      </div>
    </el-header>

    <el-main class="content">
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="formRules"
        class="max-w-xs"
      >
        <el-form-item
          :label="$t('formItem1Label')"
          prop="locale"
        >
          <el-select
            v-model="form.locale"
            :placeholder="$t('formItem1Placeholder')"
          >
            <el-option
              v-for="language in languages"
              :key="language.locale"
              :label="language.label"
              :value="language.locale"
            />
          </el-select>
        </el-form-item>
      </el-form>

      Versjon: {{ appVersion }}
    </el-main>

    <el-footer
      height="auto"
      class="flex justify-between"
    >
      <el-button
        type="text"
        @click="checkForUpdates"
      >
        Se etter oppdateringer
      </el-button>

      <div>
        <el-button
          type="text"
          @click="cancel"
        >
          {{ $t("cancel") }}
        </el-button>
        <el-button
          type="primary"
          @click="save"
        >
          {{ $t("save") }}
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import i18n from "~/i18n"
import BreadcrumbBar from "~/components/BreadcrumbBar"

export default {
  name: "ErrorScreen",

  components: {
    BreadcrumbBar
  },

  data: () => ({
    languages: [
      { label: "English", locale: "en" },
      { label: "Norwegian", locale: "no" }
    ],
    form: { locale: "no" },
    formRules: {},
    appVersion: ""
  }),

  created() {
    this.form.locale = i18n.locale
    this.appVersion = electron.remote.app.getVersion()
  },

  methods: {
    checkForUpdates() {
      electron.ipcRenderer.send("CHECK_FOR_UPDATES")
    },
    save() {
      this.$refs.form.validate((isValid) => {
        if(!isValid) {
          return this.$notify({
            type: "error",
            title: "Oops!",
            message: this.$t("validationError")
          })
        }

        i18n.locale = this.form.locale
        window.localStorage.setItem("currentLocale", this.form.locale)
      })
    },
    cancel() {
      this.$router.push("/")
    }
  }
}
</script>
