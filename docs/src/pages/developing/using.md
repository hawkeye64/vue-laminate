---
title: Using Vue Laminate
desc: How to use Vue Laminate
keys: developing
---

## Usage

Vue Laminate has a single JavaScript function. Just import it into your code where you need it.

```js
import useLaminate from 'vue-laminate'
```

You use it like this:

```js
const { setTheme, currentTheme, setElement } = useLaminate({ useCache?: true, cacheName?: 'theme', initialTheme?: 'default' })
```

The three optional object parameters with `useLaminate` are as follows:

1. **useCache** - if set to true, then LocalStorage will be used to cache the theme so it's automatically loaded next time (or on refresh). Default is `true`.
2. **cacheName** - the key to use for LocalStorage. If using multiple Vue Laminate instances, each one should have a different cacheName. Default is `theme`.
3. **initialTheme** - pass the initial theme to use on first use (or when cache is turned off). Default is `default`.

The returned items are:

1. `setTheme` (function): used to change the theme color. Example: `setTheme('red')`
2. `currentTheme` (computed): contains the current them. This is a computed value. You must use it as `currentTheme.value`.
3. `setElement` (function): for setting a specific element to bind with. Usually called in `onBeforeMount` or `onMounted` life-cycle hooks. If you want to bind to the complete page, the use `document.firstElementChild`, otherwise use a `ref` value for the specific component to bind. Call `setElement(null)` to turn off theming.

## Initial Themes and CSS classes

Vue Laminate has several different CSS modules you can use. The default one (`'vue-laminate/dist/index.css'`) supports `default`, `light`, and `dark` modes. The `default` mode let's the website (if programmed that way) to use it's own `light` and `dark` modes. Basically a hands-off, don't do anything approach. This css module also has special handling for `html`, `header`, `footer` and `aside`.

It also supplies various css classes that can be used directly. There are two **BRAND** colors, four **SURFACE** colors, two **TEXT** colors and one **SHADOW** color. These are:

- `text-brand1` and `bg-brand1`
- `text-brand2` and `bg-brand2`
- `text-surface1` and `bg-surface1`
- `text-surface2` and `bg-surface2`
- `text-surface3` and `bg-surface3`
- `text-surface4` and `bg-surface4`
- `text-text1` and `bg-text1`
- `text-text2` and `bg-text2`
- `laminate-shadow`

::: tip
If you are using the Quasar Framework, then when a component has a `color` or `bg-color` attribute, you do not need to pass in the prefix (ie: `brand1` is sufficient).
:::

All color themes that comes with Vue Laminate is available individually, in the `themes` folder. To use the `blue` theme, you can:

```js
import 'vue-laminate/dist/index.css '
import 'vue-laminate/dist/theme/red.css'

// and then in script tag
import useLaminate from 'vue-laminate'

// finally somewhere in your setup() function
const { setTheme, currentTheme, setElement } = useLaminate()
setElement(document.firstElementChild)
setTheme('red')
```

If you call `setTheme` with a theme file that is not loaded, then it will not work.

## Auto Dark Mode

If you want Vue Laminate to deal with your **dark** and **light** modes automatically, based on the user's `prefers-color-scheme: dark`, then import in the `vue-laminate/dist/auto-light-dark.css` file. Simple as that!

## Quasar Framework

If you are targeting an existing Quasar app, there is also a css override file. You do not have to use this. You can create your own override classes. However, if you do wish to use this, then just:

```js
import 'vue-laminate/dist/quasar-shim.css'
```

If you don't like the shim we are providing, you can always create your own and use ours as a starting template.

For other libraries, you will have to create your own CSS overrides. PRs are welcomed!

## Importing

There are also some convenience css components that allow you to import all, import light, or import dark themes all at once.

```js
import 'vue-laminate/dist/themes/all-themes.css'
import 'vue-laminate/dist/themes/all-dark.css'
import 'vue-laminate/dist/themes/all-light.css'
```

## Themes

The current themes are: `amber`, `amber-dark`, `blue-green`, `blue-green-dark`, `blue-grey`, `blue-grey-dark`, `blue`, `blue-dark`, `brown`, `brown-dark`, `cyan`, `cyan-dark`, `green`, `green-dark`, `grey`, `grey-dark`, `indigo`, `indigo-dark`, `light-blue`, `light-blue-dark`, `light-green`, `light-green-dark`, `lime`, `lime-dark`, `orange`, `orange-dark`, `pink`, `pink-dark`, `purple`, `purple-dark`, `red`, `red-dark`, `teal`, `teal-dark`, `yellow`, and `yellow-dark`.

There is one additional theme called `dim` available.

Don't forget, you can make your own. This will be explained in the next section.
