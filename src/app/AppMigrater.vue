<i18n>
{
  "en": {
    "title": "Database migration required"
  },
  "no": {
    "title": "Oppgradering av databasen er påkrevet"
  }
}
</i18n>

<style lang="stylus">
// #app-migrater
</style>

<template>
  <div
    id="app-migrater"
    class="p-5"
  >
    <h2 class="block">
      Data i følgende tabeller vil bli overført:
    </h2>

    <ul class="block">
      <li
        v-for="collection in collections"
        :key="collection.name"
      >
        {{ collection.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  name: "NsuMigrater",

  props: {
    collections: { type: Array, required: true },
    statuses: {}
  },

  created() {
    this.collections.forEach((collection) => {
      this.statuses[collection.name] = {}

      const migrationState$ = collection.migrate(10)

      migrationState$.subscribe(
        state => console.dir(state),
        error => console.error(error),
        done => console.log('done')
      )
    })
  }
}
</script>
