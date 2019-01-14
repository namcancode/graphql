import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import Vue from 'vue'
import { Notification } from 'element-ui'

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(err => {
        setTimeout(() => {
          Notification.error(err.message)
        }, 0)
      })
    } else if (networkError) {
      Notification.error('Lỗi kết nối đến máy chủ. Xin vui lòng thử lại')
    }
  }
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

Vue.use(VueApollo)
