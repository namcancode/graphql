import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import user, { IUserState } from '@/store/user/index'
import { apolloClient } from '@/plugins/apollo'
import gql from 'graphql-tag'

Vue.use(Vuex)

interface State {
  user: IUserState
}

const store = new Vuex.Store({
  state: {
    ready: false
  },
  mutations: {
    APP_READY(state, ready: boolean = true) {
      state.ready = ready
    }
  },
  actions: {
    async init({ commit }) {
      const rs = await apolloClient.query({
        query: gql`
          query {
            version
            auth {
              username
              role
              company
              lang
            }
          }
        `
      }) as {data: any}

      if (localStorage.getItem('ihr-version') !== rs.data.version) {
        localStorage.setItem('ihr-version', rs.data.version)
        window.location.reload(true)
      }

      rs.data.auth ? commit('LOGIN_SUCCESS', rs.data.auth) : ''
      commit('APP_READY')
    }
  },
  modules: { user }
}) as Store<State>

export default store
