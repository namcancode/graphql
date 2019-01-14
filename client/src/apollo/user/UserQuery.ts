import gql from 'graphql-tag'

export const userFragment = gql`
  fragment User on User {
    company
    username
    role
    lang
    id
  }
`

export const listUser = gql`
  query($filter: UserFilterInput!) {
    users(filter: $filter) {
      company
      username
      role
      lang
      id
    }
  }
`

export const getUser = gql`
  query($id: String!) {
    user(id: $id) {
      username
      role
      lang
      id
    }
  }
`
