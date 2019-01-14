import { ObjectId } from 'bson'
import { Document } from 'mongoose'

export interface IJavietEngage {
  content: string
  note?: string
  historyId: ObjectId | string
  method: string
}

export interface IJavietDocument extends IJavietEngage, Document {}

export const JAVIET_STEP = [
  '0. Chưa liên lạc',
  '1. Đã liên lạc được',
  '2. Đã chốt lịch lên VP',
  '3. Đã lên VP',
  '4. Đã khám sức khỏe',
  '5 .Đã nộp cọc',
  '6. Dừng chăm sóc'
]