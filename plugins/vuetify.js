import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            background: '#1b1b1b',
            surface: '#1e1e1e',
            primary: '#1976D2',
          },
        },
      },
    },
  })
  nuxtApp.vueApp.use(vuetify)
})
