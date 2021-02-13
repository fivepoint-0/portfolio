import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      dark: {
        primary: '#ff00ff',
        secondary: '#00ffff',
        accent: '#9933ff',
        error: '#99004c'
      }
    },
    dark: true
  }
})
