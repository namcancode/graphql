import { Schema, model } from 'mongoose'
import { IApplicantTagDocument } from '../interface/ApplicantTag'

export const applicantTagSchema = new Schema(
  {
    applicantUid: {
      required: true,
      type: String
    }
  },
  { strict: false }
)

applicantTagSchema.virtual('applicant', {
  ref: 'Applicant',
  justOne: true,
  localField: 'applicantUid',
  foreignField: 'uid'
})

export default model<IApplicantTagDocument>('ApplicantTag', applicantTagSchema, 'applicant_tag')
