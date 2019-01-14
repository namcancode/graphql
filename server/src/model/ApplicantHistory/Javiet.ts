import { Schema, model } from 'mongoose'
import { IJavietDocument } from '../../interface/ApplicantHistory/Javiet'
import * as mongoosePaginate from 'mongoose-paginate'
import { COMPANY } from '@/interface/User'

export const JavietSchema = new Schema(
  {
    applicantId: {
      required: true,
      type: Schema.Types.ObjectId
    },
    company: {
      type: String,
      default: COMPANY.JAVIET,
      required: true,
      trim: true,
      lowercase: true
    },
    recruiter: {
      type: String,
      default: ''
    },
    engageStatus: {
      default: 0,
      type: Number
    },
    reasonEngageStop: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
)

JavietSchema.virtual('applicant', {
  ref: 'Applicant',
  justOne: true,
  localField: 'applicantId',
  foreignField: '_id'
})

JavietSchema.virtual('listEngage', {
  ref: 'JavietApplicantEngage',
  localField: '_id',
  foreignField: 'historyId'
})

JavietSchema.pre('find', function() {
  this.find({ company: COMPANY.JAVIET })
})
JavietSchema.pre('findOne', function() {
  this.find({ company: COMPANY.JAVIET })
})
JavietSchema.pre('update', function() {
  this.update({ company: COMPANY.JAVIET }, {})
})
JavietSchema.pre('updateOne', function() {
  this.update({ company: COMPANY.JAVIET }, {})
})

JavietSchema.plugin(mongoosePaginate)

export default model<IJavietDocument>('Javiet', JavietSchema, 'applicant_history')
