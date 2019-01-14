import { gql } from 'apollo-server'

export const tinhloiSchema = gql`
  type TinhLoi {
    applicant: Applicant!
    listEngage: [TinhLoiEngage!]
    applicantId: String
    company: String!
    interviewDate: String
    status: Int!
    telesaleStatus: String!
    telesale: String!
    screeningStatus: String
    interviewStatus: String
    offerStatus: String
    note: String
    id: String
  }

  type totalTinhLoi {
    docs: [TinhLoi]
    page: Int
    limit: Int
    total: Int
  }

  extend type Query {
    list(filter: TinhLoiTelesaleFilterInput!, pagination: PagingInput!): totalTinhLoi!
  }

  extend type Mutation {
    createTinhLoi(data: TinhLoiInput): Boolean
  }

  input TinhLoiTelesaleFilterInput {
    interviewDate: [String]
    offerStatus: [String]
    interviewStatus: [String]
    screeningStatus: [String]
    company: [String]
    callBackTime: [String]
    searchApplicant: ApplicantFilterInput
  }

  input TinhLoiInput {
    applicantId: String!
    company: String!
    interviewDate: String
    status: Int!
    telesaleStatus: String!
    telesale: String!
    screeningStatus: String
    interviewStatus: String
    offerStatus: String
    note: String
  }
`
