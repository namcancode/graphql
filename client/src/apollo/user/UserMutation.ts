import gql from 'graphql-tag'

export const loginAs = gql`
  mutation($userId: String!) {
    loginAs(userId: $userId) {
      username
      company
      role
      lang
    }
  }
`

export const userDelete = gql`
  mutation($userId: String!) {
    delete(userId: $userId)
  }
`

export const userCreate = gql`
  mutation($data: UserInput!) {
    create(data: $data)
  }
`

export const userUpdate = gql`
  mutation($userId: String!, $data: UserInput!) {
    update(userId: $userId, data: $data)
  }
`
