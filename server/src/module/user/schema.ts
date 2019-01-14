import { gql } from 'apollo-server'

export const userSchema = gql`
  type User {
    username: String!
    role: String!
    company: String
    lang: String!
    id: String!
  }

  extend type Query {
    users(filter: UserFilterInput!): [User]!
    user(id: String!): User
  }

  extend type Mutation {
    loginAs(userId: String!): User!
    delete(userId: String!): Boolean
    create(data: UserInput!): Boolean
    update(userId: String!, data: UserInput!): Boolean
  }

  input UserFilterInput {
    search: String!
    role: [String!]!
    company: [String!]!
  }

  input UserInput {
    username: String!
    password: String
    role: String!
    lang: String!
  }
`
