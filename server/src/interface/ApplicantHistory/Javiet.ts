import { ObjectId } from 'bson'
import { Document } from 'mongoose'
import { APPLICANT_STATUS, IApplicant } from '../Applicant'

export interface IJaviet {
  applicantId: ObjectId
  company: string
  engageStatus?: number
  recruiter: string
  reasonEngageStop?: string
  createdAt?: Date
  updatedAt?: Date
  applicant?: IApplicant
}

export interface IJavietDocument extends Document, IJaviet {}

//I do not know what the hell it is
// export function getApplicantStatusFromApplicantHistory(applicantHistory: IJavietDocument) {
//   return APPLICANT_STATUS.IN_PROGRESS
// }
