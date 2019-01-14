import { ObjectId } from 'bson'
import { Document } from 'mongoose'

export interface IApplicantHistory {
  applicantId: ObjectId
  company: string
}

export interface IApplicantHistoryDocument extends Document, IApplicantHistory {}
