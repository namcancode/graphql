import { Document } from 'mongoose'

export interface IApplicantTag {
  applicantUid: string
}

export interface IApplicantTagDocument extends Document, IApplicantTag {}
