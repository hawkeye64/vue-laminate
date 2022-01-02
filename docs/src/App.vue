<template>
  <router-view />
</template>

<script>
import { defineComponent } from 'vue'
import { useMeta } from 'quasar'

import { provideMarkdownStore } from 'assets/markdown-store.js'
import getMeta from 'assets/get-meta.js'

export default defineComponent({
  name: 'App',

  setup () {
    useMeta({
      title: 'Vue Laminate » skins for your Vue apps',
      titleTemplate: title => `${ title } » Vue Laminate`,

      meta: getMeta(
        'Vue Laminate - skins for your Vue apps',
        'Vue Laminate allows you to skin your Vue apps.'
      )
    })

    provideMarkdownStore()
  }
})
</script>
