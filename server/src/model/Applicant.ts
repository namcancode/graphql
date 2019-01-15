import { Schema, model } from 'mongoose'
import { IApplicantDocument, APPLICANT_STATUS, LIST_PROVINCE } from '../interface/Applicant'
import * as mongoosePaginate from 'mongoose-paginate'
import ApplicantTag from './ApplicantTag'
import Javiet from './ApplicantHistory/Javiet'
import TinhLoi from './ApplicantHistory/TinhLoi'

import ApplicationError from '@/library/ApplicationError'

export const ApplicantSchema = new Schema({
  name: {
    required: [true, 'Ứng viên chưa có tên'],
    type: String,
    trim: true,
    lowercase: true
  },
  identityNumber: {
    type: String,
    default: '',
    trim: true,
    validate: {
      validator: value => !value || /^(\d{9}|\d{12})$/g.test(value.trim()),
      message: 'Định dạng chứng minh nhân dân chưa đúng.'
    }
  },
  phone: {
    default: '',
    type: String,
    trim: true,
    validate: {
      validator: value => !value || /^0(\d){9,10}$/g.test(value.trim()),
      message: 'Định dạng sđt chưa đúng.'
    }
  },
  birthday: {
    type: Date
  },
  yearOfBirth: {
    type: Number,
    default: 0
  },
  province: {
    default: '',
    type: String,
    trim: true,
    lowercase: true,
    validate: value => value === '' || LIST_PROVINCE.includes(value.trim().toLowerCase())
  },
  gender: {
    default: '',
    type: String,
    trim: true,
    lowercase: true,
    validate: value => /^(nam|nữ|)$/gi.test(value.trim())
  },
  source: {
    default: '',
    type: String,
    trim: true,
    lowercase: true
  },
  uid: {
    default: '',
    type: String,
    trim: true,
    validate: {
      validator: value => !value || /^(\d+)$/g.test(value.trim()),
      message: 'Link Facebook chưa đúng'
    }
  },
  page: {
    default: '',
    type: String,
    trim: true,
    lowercase: true
  },
  note: {
    type: String,
    default: ''
  },
  status: {
    required: [true, 'Chưa điền trạng thái ứng viên'],
    validate: {
      validator: value => Object.values(APPLICANT_STATUS).indexOf(value) > -1,
      message: 'Trạng thái không tồn tại'
    },
    type: String
  },
  createdAt: { type: Date, default: Date.now }
})

ApplicantSchema.post('save', (err, doc, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    throw new ApplicationError('Ứng viên đã tồn tại trong hệ thống')
  } else {
    next(err)
  }
})

ApplicantSchema.post('remove', (doc: IApplicantDocument) => {
  ApplicantTag.deleteMany({ applicantId: doc._id }).exec()
  Javiet.deleteMany({ applicantId: doc._id }).exec()
  TinhLoi.deleteMany({ applicantId: doc._id }).exec()
})

ApplicantSchema.plugin(mongoosePaginate)

export default model<IApplicantDocument>('Applicant', ApplicantSchema, 'applicant_info')
