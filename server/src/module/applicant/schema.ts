import { gql } from 'apollo-server'

export const applicantSchema = gql`
  type Applicant {
    name: String
    identityNumber: String
    phone: String
    birthday: String
    province: String
    gender: String
    source: String
    status: String!
    createdAt: String
    uid: String
    yearOfBirth: Int
    page: String
    note: String
    id: String
  }

  type totalApplicant {
    docs: [Applicant]
    page: Int
    limit: Int
    total: Int
  }

  extend type Query {
    applicant(id: String!): Applicant
    listApplicant(filter: ApplicantFilterInput!, pagination: PagingInput!): totalApplicant
  }

  extend type Mutation {
    applicantCreate(data: ApplicantInfo!): Boolean
    applicantUpdate(applicantId: String!, data: ApplicantInfo!): Boolean
    applicantDelete(applicantId: String!): Boolean
  }

  input ApplicantFilterInput {
    name: String
    identityNumber: String
    phone: String
    province: String
    gender: String
    source: String
    status: String
    uid: String
    page: String
  }

  input ApplicantInfo {
    name: String!
    identityNumber: String
    phone: String!
    birthday: String
    province: String
    gender: String
    source: String
    status: String!
    uid: String
    yearOfBirth: Int
    page: String
    note: String
  }

  input PagingInput {
    page: Int!
    limit: Int!
  }
`
