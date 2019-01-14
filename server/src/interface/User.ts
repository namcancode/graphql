import { Document } from 'mongoose'
import { ObjectId } from 'bson'

export const USER_ROLE = {
  ADMIN: 'admin',
  MARKETER: 'marketer',
  JAVIET_ADMIN: 'javiet_admin',
  JAVIET_RECRUITER: 'javiet_recruiter',
  TINHLOI_RECRUITER: 'tinhloi_recruiter',
  TINHLOI_TELESALE: 'tinhloi_telesale'
}

export interface IUser {
  username: string
  company: string
  role: string
  password?: string
  name?: string
  lang?: string
}

export const COMPANY = {
  JAVIET: 'javiet',
  TINHLOI: 'tinhloi'
}

export interface IUserDocumentLean extends IUser {
  _id: ObjectId
}

export interface IUserDocument extends Document, IUser {}
