export interface Javiet {
  applicantId: string
  company: string
  engageStatus: number
  recruiter: string
}

export interface JavietDoc extends Javiet {
  _id: string
  createdAt: Date
}

export const JAVIET_STEP = [
  '0. Chưa liên lạc',
  '1. Đã liên lạc được',
  '2. Đã chốt lịch lên VP',
  '3. Đã lên VP',
  '4. Đã khám sức khỏe',
  '5 .Đã nộp cọc',
  '6. Dừng chăm sóc'
]