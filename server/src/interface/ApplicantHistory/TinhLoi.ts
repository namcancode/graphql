import { ObjectId } from 'bson'
import { Document } from 'mongoose'
import { APPLICANT_STATUS } from '../Applicant';

export interface ITinhLoi {
  applicantId: ObjectId
  company: string
  interviewDate?: Date
  status: number
  telesaleStatus: string
  telesale: string
  screeningStatus?: string
  interviewStatus?: string
  offerStatus?: string
  note?: string
}

export interface ITinhLoiDocument extends Document, ITinhLoi {}

export const SCREENING_STATUS = {
  PASS: 'đạt',
  REJECT: 'loại',
  EMPTY: ''
}

export const INTERVIEW_STATUS = {
  PASS: 'đạt',
  REJECT: 'loại',
  REFUSE_INTERVIEW: 'từ chối phỏng vấn',
  EMPTY: ''
}

export const OFFER_STATUS = {
  ACCEPT: 'nhận offer',
  REFUSE_OFFER: 'không nhận offer',
  EMPTY: ''
}

export const TELESALE_STATUS = {
  DOING: 'Đang chăm sóc',
  STOP: 'Dừng chăm sóc',
  OUTOFTARGET: 'Ngoài Target',
  PAUSE: 'Tạm dừng chăm sóc'
}

export function getApplicantStatusFromApplicantHistory(applicantHistory: ITinhLoiDocument) {
  if (applicantHistory.screeningStatus === SCREENING_STATUS.REJECT) {
    return APPLICANT_STATUS.AVAILABLE
  }

  if (applicantHistory.interviewStatus === INTERVIEW_STATUS.REJECT || applicantHistory.interviewStatus === INTERVIEW_STATUS.REFUSE_INTERVIEW) {
    return APPLICANT_STATUS.AVAILABLE
  }

  if (applicantHistory.offerStatus === OFFER_STATUS.REFUSE_OFFER) {
    return APPLICANT_STATUS.AVAILABLE
  }

  if (applicantHistory.offerStatus === OFFER_STATUS.ACCEPT) {
    return APPLICANT_STATUS.NOT_AVAILABLE
  }

  return APPLICANT_STATUS.IN_PROGRESS
}
