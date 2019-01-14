import { gql } from 'apollo-server'

export const schema = gql`
  directive @auth on FIELD | FIELD_DEFINITION
  directive @role(role: String) on FIELD | FIELD_DEFINITION

  type Query {
    version: String!
    auth: User
  }

  type Mutation {
    login(username: String!, password: String!): User
    logout: Boolean
  }
`
