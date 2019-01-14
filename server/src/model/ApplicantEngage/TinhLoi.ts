import { Schema, model } from 'mongoose'
import { ITinhLoiDocument } from '@/interface/ApplicantEngage/TinhLoi'

export const TinhLoiSchema = new Schema(
  {
    historyId: {
      required: [true, 'Chưa có ứng viên'],
      type: Schema.Types.ObjectId
    },
    callBackTime: {
      type: Date
    },
    callStatus: {
      type: String,
      required: [true, 'Chưa có trạng thái cuộc gọi']
    },
    note: String
  },
  {
    timestamps: true
  }
)

TinhLoiSchema.virtual('history', {
  ref: 'TinhLoi',
  localField: 'historyId',
  foreignField: '_id',
  justOne: true
})

TinhLoiSchema.pre('updateOne', function() {
  this.update({}, { updatedAt: Date.now() })
})

export default model<ITinhLoiDocument>('TinhLoiApplicantEngage', TinhLoiSchema, 'applicant_engage')
