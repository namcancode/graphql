import { directive as vClickOutside } from 'vue-clickaway'
import { VueConstructor } from 'vue'
import ElementUI from 'element-ui'
import { FormElement, Card } from '@/components'

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

const GlobalDirectives = {
  install(Vue: VueConstructor) {
    Vue.directive('click-outside', vClickOutside)
    Vue.component('Form-Element', FormElement)
    Vue.component('FormElement', FormElement)
    Vue.component('Card', Card)
    Vue.use(ElementUI)
  }
}

export default GlobalDirectives
