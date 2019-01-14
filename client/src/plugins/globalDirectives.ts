import { directive as vClickOutside } from 'vue-clickaway'
import { VueConstructor, PluginObject } from 'vue'
import { Loading } from 'element-ui';

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(Vue: VueConstructor) {
    Vue.directive('click-outside', vClickOutside)
    Vue.use(<PluginObject<any>>Loading.directive)
  }
}

export default GlobalDirectives
