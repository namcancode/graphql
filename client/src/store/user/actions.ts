import request from '@/plugins/request'
import { ActionTree } from 'vuex'
import router from '@/router'
import { IUserState } from '@/store/user'
import { apolloClient } from '@/plugins/apollo'
import { logoutMutation } from '@/apollo/auth/AuthMutation'

const actions: ActionTree<IUserState, any> = {
  async logout({ commit }) {
    await apolloClient.mutate({ mutation: logoutMutation })
    commit('LOGOUT')
  },
  async changeLang({ commit }) {
    request.get('auth/change-lang')
    commit('CHANGE_LANG')
  }
}

export default actions
