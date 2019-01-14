import { gql } from 'apollo-server'

export const tinhloiEngageSchema = gql`
  type TinhLoiEngage {
    callBackTime: String
    note: String
    historyId: String
    callStatus: String
  }
`
