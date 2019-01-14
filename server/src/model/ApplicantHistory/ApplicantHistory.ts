import { Schema, model } from 'mongoose'
import { IApplicantHistoryDocument } from '../../interface/ApplicantHistory/ApplicantHistory'

export const ApplicantHistorySchema = new Schema({
  applicantId: {
    required: true,
    type: Schema.Types.ObjectId
  },
  company: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: { type: Date, default: Date.now }
})

export default model<IApplicantHistoryDocument>('ApplicantHistory', ApplicantHistorySchema, 'applicant_history')
