import gql from 'graphql-tag'

export const listApplicant = gql`
  query($filter: TinhLoiTelesaleFilterInput!, $pagination: PagingInput!) {
    list(filter: $filter, pagination: $pagination) {
      docs {
        applicant {
          name
          phone
          source
          gender
          identityNumber
          province
          note
          createdAt
        }
        interviewDate
        offerStatus
        interviewStatus
        screeningStatus
        status
        telesale
        telesaleStatus
      }
      page
      limit
      total
    }
  }
`
