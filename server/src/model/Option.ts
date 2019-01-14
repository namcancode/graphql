import { Document, Schema, model } from 'mongoose'

export interface IOption extends Document {
  name: string
  value: any
}

const OptionSchema = new Schema({
  name: { required: true, type: String, trim: true },
  value: { required: true, type: Schema.Types.Mixed }
})

const Option = model<IOption>('Option', OptionSchema, 'option')

export default Option

export async function getOption(name: string, defaultValue: any = null) {
  const optionDocument = (await Option.findOne({ name })) || { value: null }
  return optionDocument.value || defaultValue
}

export function updateOption(name: string, value: any) {
  return Option.updateOne({ name }, { value }, { upsert: true })
}
