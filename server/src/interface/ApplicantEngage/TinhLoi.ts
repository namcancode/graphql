import { ObjectId } from 'bson'
import { Document } from 'mongoose'

export interface ITinhLoiEngage {
  callBackTime?: Date
  note?: string
  historyId: ObjectId | string
  callStatus: string
}

export interface ITinhLoiDocument extends ITinhLoiEngage, Document {}
