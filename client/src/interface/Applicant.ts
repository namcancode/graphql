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

export const APPLICANT_STATUS = {
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  NOT_AVAILABLE: 'not_available'
}

export interface IApplicant {
  name: string
  identityNumber?: string
  phone: string
  birthday?: Date
  province?: string
  gender?: 'nam' | 'nữ'
  source?: string
  status: string
  createdAt?: Date
  uid: string
  yearOfBirth: number
  page?: string
  note?: string
}

export interface IApplicantHistory {
  applicantId: string
  company: string
  interviewDate: Date
  engageStatus: number
  screeningStatus: string
  interviewStatus: string
  offerStatus: string
  screeningNote: string
  interviewNote: string
  offerNote: string
  note: string
}

export const LIST_PROVINCE = [
  'an giang',
  'bà rịa-vũng tàu',
  'bình dương',
  'bình phước',
  'bình thuận',
  'bình định',
  'bạc liêu',
  'bắc giang',
  'bắc kạn',
  'bắc ninh',
  'bến tre',
  'cao bằng',
  'cà mau',
  'cần thơ',
  'gia lai',
  'hà giang',
  'hà nam',
  'hà nội',
  'hà tĩnh',
  'hòa bình',
  'hưng yên',
  'hải dương',
  'hải phòng',
  'hậu giang',
  'hồ chí minh',
  'khánh hòa',
  'kiên giang',
  'kon tum',
  'lai châu',
  'long an',
  'lào cai',
  'lâm đồng',
  'lạng sơn',
  'nam định',
  'nghệ an',
  'ninh bình',
  'ninh thuận',
  'phú thọ',
  'phú yên',
  'quảng bình',
  'quảng nam',
  'quảng ngãi',
  'quảng ninh',
  'quảng trị',
  'sóc trăng',
  'sơn la',
  'thanh hóa',
  'thái bình',
  'thái nguyên',
  'thừa thiên huế',
  'tiền giang',
  'trà vinh',
  'tuyên quang',
  'tây ninh',
  'vĩnh long',
  'vĩnh phúc',
  'yên bái',
  'điện biên',
  'đà nẵng',
  'đắk lắk',
  'đắk nông',
  'đồng nai',
  'đồng tháp'
]
