import { ref, computed, watch } from 'vue';
import { tryOnMounted } from '@vueuse/core'

export default function ({ useCache = true, cacheName = 'theme', initialTheme = 'default' } = {}) {
  const theme = ref(initialTheme)
  const el = ref(null)

  tryOnMounted(() => {
    if (useCache === true && themeCache.has(cacheName)) {
      const val = themeCache.get(cacheName)
      if (typeof val === 'string') {
        theme.value = val
      }
    }
    setTheme(theme.value)
  })

  const currentTheme = computed(() => theme.value)

  watch(theme, val => {
    setTheme(val)
  })

  const currentElement = () => el.value

  const setElement = (element) => {
    // remove any existing
    if (el.value && el.value.getAttribute('laminate-scheme')) {
      el.value.removeAttribute('laminate-scheme')
      el.value.classList.remove('vue-laminate')
    }

    if (element) {
      // set new element
      el.value = element
      // set current theme on the element
      setTheme(currentTheme.value)
      return true
    }
    return false
  }

  const setTheme = t => {
    useCache && themeCache.set(cacheName, t)
    theme.value = t
    if (el.value) {
      // if theme is NOT 'defaut'
      if (t !== 'default') {
        // set the class
        el.value.classList.add('vue-laminate')
        // set the scheme
        el.value.setAttribute('laminate-scheme', t)
      }
      else {
        if (el.value && el.value.getAttribute('laminate-scheme')) {
          el.value.removeAttribute('laminate-scheme')
          el.value.classList.remove('vue-laminate')
        }    
      }
      return true
    }
    return false
  }

  const themeCache = {
    has: key => localStorage && !!localStorage.getItem(key),
    get: key =>localStorage && localStorage.getItem(key),
    set: (key, value) => localStorage && localStorage.setItem(key, value)
  }

  return {
    setTheme,
    setElement,
    currentTheme,
    currentElement,
    themeCache
  }
}
