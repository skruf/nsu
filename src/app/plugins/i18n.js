import VueI18n from "vue-i18n"
import locales from "~/i18n"

export default new VueI18n({
  fallbackLocale: "en",
  messages: locales
})
