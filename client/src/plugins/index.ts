import GlobalDirectives from '@/plugins/globalDirectives'
import 'es6-promise/auto'
//css assets
import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/sass/paper-dashboard.scss'
import '@/assets/css/themify-icons.css'
import { VueConstructor } from 'vue'
import '@/plugins/filter'
import * as Sentry from '@sentry/browser'

export default {
  install(Vue: VueConstructor) {
    Vue.use(GlobalDirectives)

    if (process.env.VUE_APP_PRODUCTION) {
      Sentry.init({
        dsn: process.env.VUE_APP_SENTRY,
        integrations: [new Sentry.Integrations.Vue({ Vue })]
      })
    }
  }
}
