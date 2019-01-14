import { query, mutation } from '@/module/main/resolver'
import { userQuery, userMutation } from './user/resolver'
import { applicantQuery, applicantMutation } from '@/module/applicant/resolver'
import { tinhloiPartnerQuery, tinhloiPartnerMutation } from '@/module/tinhloi/history/resolver/PartnerResolver'
import { tinhloiTelesaleQuery, tinhloiTelesaleMutation } from '@/module/tinhloi/history/resolver/TelesaleResolver'
import { schema } from '@/module/main/schema'
import { userSchema } from '@/module/user/schema'
import { tinhloiSchema } from '@/module/tinhloi/history/schema'
import { applicantSchema } from '@/module/applicant/schema'
import { tinhloiEngageSchema } from './tinhloi/engage/schema'
import { tinhloiEnageQuery, tinhloiEngageMutation } from './tinhloi/engage/resolver'
import { userMapper } from '@/module/user/resolver'
import { applicantResolver } from '@/module/applicant/resolver'
import { tinhloiResolver } from '@/module/tinhloi/history/resolver/TinhLoiResolver'

const Query = {
  ...query,
  ...userQuery,
  ...applicantQuery,
  ...tinhloiTelesaleQuery,
  ...tinhloiPartnerQuery,
  ...tinhloiEnageQuery
}

const Mutation = {
  ...mutation,
  ...userMutation,
  ...applicantMutation,
  ...tinhloiTelesaleMutation,
  ...tinhloiPartnerMutation,
  ...tinhloiEngageMutation
}

const Schema = [schema, userSchema, applicantSchema, tinhloiSchema, tinhloiEngageSchema]

const Resolver = { ...userMapper, ...applicantResolver, ...tinhloiResolver }

export const optionSever = {
  typeDefs: Schema,
  resolvers: {
    Query,
    Mutation,
    ...Resolver
  },
  context: ({ ctx }) => ctx
}
