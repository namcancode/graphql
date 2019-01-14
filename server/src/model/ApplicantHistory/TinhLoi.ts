import { Schema, model, Document } from 'mongoose'
import { ITinhLoiDocument, SCREENING_STATUS, INTERVIEW_STATUS, OFFER_STATUS } from '@/interface/ApplicantHistory/TinhLoi'
import * as mongoosePaginate from 'mongoose-paginate'
import { COMPANY } from '@/interface/User'


export const TinhLoiSchema = new Schema(
  {
    applicantId: {
      required: true,
      type: Schema.Types.ObjectId
    },
    company: {
      type: String,
      default: COMPANY.TINHLOI,
      required: true,
      trim: true,
      lowercase: true
    },
    interviewDate: {
      type: Date
    },
    status: {
      type: Number,
      default: 3
    },
    telesaleStatus: {
      type: String,
      default: ''
    },
    telesale: {
      type: String,
      default: ''
    },
    screeningStatus: {
      trim: true,
      lowercase: true,
      type: String,
      default: '',
      validate: value => inStatus(SCREENING_STATUS, value)
    },
    interviewStatus: {
      trim: true,
      lowercase: true,
      type: String,
      default: '',
      validate: value => inStatus(INTERVIEW_STATUS, value)
    },
    offerStatus: {
      default: '',
      type: String,
      trim: true,
      lowercase: true,
      validate: value => inStatus(OFFER_STATUS, value)
    },
    note: String
  },
  {
    timestamps: true
  }
)

TinhLoiSchema.virtual('applicant', {
  ref: 'Applicant',
  justOne: true,
  localField: 'applicantId',
  foreignField: '_id'
})

TinhLoiSchema.virtual('listEngage', {
  ref: 'TinhLoiApplicantEngage',
  localField: '_id',
  foreignField: 'historyId'
})

TinhLoiSchema.pre('find', function() {
  this.find({ company: COMPANY.TINHLOI })
})
TinhLoiSchema.pre('findOne', function() {
  this.find({ company: COMPANY.TINHLOI })
})
TinhLoiSchema.pre('update', function() {
  this.update({ company: COMPANY.TINHLOI }, {})
})
TinhLoiSchema.pre('updateOne', function() {
  this.update({ company: COMPANY.TINHLOI }, {})
})


TinhLoiSchema.plugin(mongoosePaginate)

export default model<ITinhLoiDocument>('TinhLoi', TinhLoiSchema, 'applicant_history')

function inStatus(mapStatus: object, value: string) {
  return Object.values(mapStatus).indexOf(value.trim().toLowerCase()) > -1
}
