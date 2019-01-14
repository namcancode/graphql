import { Schema, model } from 'mongoose'
import { IJavietDocument } from '@/interface/ApplicantEngage/Javiet'

export const JavietSchema = new Schema(
  {
    historyId: {
      required: [true, 'Chưa có ứng viên'],
      type: Schema.Types.ObjectId
    },
    method: {
      required: [true, 'Chưa có hình thức tư vấn'],
      type: String
    },
    content: {
      required: [true, 'Chưa có nội dung tư vấn'],
      type: String
    },
    note: String
  },
  {
    timestamps: true
  }
)

JavietSchema.virtual('history', {
  ref: 'Javiet',
  localField: 'historyId',
  foreignField: '_id',
  justOne: true
})

JavietSchema.pre('updateOne', function() {
  this.update({}, { updatedAt: Date.now() })
})

export default model<IJavietDocument>('JavietApplicantEngage', JavietSchema, 'applicant_engage')
