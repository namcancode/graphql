import { MutationTree } from 'vuex'
import router from '@/router'
import i18n from '@/plugins/i18n'
import vi from 'element-ui/lib/locale/lang/vi'
import en from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import { IUserState } from '@/store/user'

const listLang = { vi, en }

const mutations: MutationTree<IUserState> = {
  LOGIN_SUCCESS(state, userInfo) {
    state = Object.assign(state, userInfo)
  },
  // LOGIN_FAIL(state, message) {
    
  // },
  CHANGE_LANG(state, lang: 'vi' | 'en') {
    i18n.locale = state.lang = lang
    locale.use(listLang[lang])
  },
  LOGOUT(state) {
    state = Object.assign(state, {})
    router.push({name: 'login'})
  }
}

export default mutations
