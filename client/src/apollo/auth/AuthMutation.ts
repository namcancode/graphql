import gql from 'graphql-tag'
import { userFragment } from '@/apollo/user/UserQuery'

export const loginMutation = gql`
  mutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ...User
    }
  }
  ${userFragment}
`

export const logoutMutation = gql`
  mutation {
    logout
  }
`
