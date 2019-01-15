import { Schema, model, Model, Query } from 'mongoose'
import { IUserDocument } from '../interface/User'
import { createHmac } from 'crypto'
import { PASSWORD_HASH } from '../config'

export const schema = new Schema({
  username: { type: String, required: true },
  password: String,
  role: { type: String, required: true },
  name: { type: String, default: '' },
  lang: { type: String, default: 'vi' }
})

schema.pre('updateOne', function(next) {
  const vm = <any>this
  if (vm._update.password) {
    vm._update.password = getCryptPassword(vm._update.password)
  }
  next()
})

schema.pre('save', function(next) {
  const vm = <any>this
  if (vm.password) {
    vm.password = getCryptPassword(vm.password)
  }
  next()
})

schema.virtual('company').get(function() {
  const [company, role] = this.role.split('_')
  return role ? company : null
})

schema.query.company = function(company: string) {
  return this.find({ role: new RegExp(`^${company}_.*`, 'i') })
}

export function getCryptPassword(password) {
  return createHmac('sha512', PASSWORD_HASH).update(password).digest('hex')
}

export default model<IUserDocument>('User', schema, 'user')
