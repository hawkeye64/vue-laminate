import { ref, computed, watch } from 'vue';
import { tryOnMounted } from '@vueuse/core'


export default function ({ useCache = true, cacheName = 'theme', initialTheme = 'default' } = {}) {

  class Laminated {
    constructor({ useCache, cacheName, initialTheme }) {
      this.useCache = useCache
      this.cacheName = cacheName
      this.themeName = ref(initialTheme)
      this.el = ref(null)
    }

    onMounted = (element) => {
      if (this.useCache === true && this.themeCache.has(this.cacheName)) {
        const val = this.themeCache.get(this.cacheName)
        if (typeof val === 'string') {
          this.themeName.value = val
        }
      }
      this.setTheme(this.themeName.value)
      element && this.setElement(element)

      watch(this.themeName, val => {
        this.setTheme(val)
      })
    }

    setElement = (element) => {
      // remove any existing
      if (this.el.value && this.el.value.getAttribute('laminate-scheme')) {
        this.el.value.removeAttribute('laminate-scheme')
        this.el.value.classList.remove('vue-laminate')
      }

      if (element) {
        // set new element
        this.el.value = element
        // set current theme on the element
        this.setTheme(this.themeName.value)
        return true
      }
      return false
    }

    setTheme = t => {
      this.useCache && this.themeCache.set(this.cacheName, t)
      this.themeName.value = t
      if (this.el.value) {
        // if theme is NOT 'defaut'
        if (t !== 'default') {
          // set the class
          this.el.value.classList.add('vue-laminate')
          // set the scheme
          this.el.value.setAttribute('laminate-scheme', t)
        }
        else {
          if (this.el.value && this.el.value.getAttribute('laminate-scheme')) {
            this.el.value.removeAttribute('laminate-scheme')
            this.el.value.classList.remove('vue-laminate')
          }
        }
        return true
      }
      return false
    }

    themeCache = {
      has: key => localStorage && !!localStorage.getItem(key),
      get: key =>localStorage && localStorage.getItem(key),
      set: (key, value) => localStorage && localStorage.setItem(key, value)
    }
  }

  return {
    laminate: new Laminated({ useCache, cacheName, initialTheme })
  }
}
