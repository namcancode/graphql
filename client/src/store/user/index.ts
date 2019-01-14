import mutations from '@/store/user/mutations'
import actions from '@/store/user/actions'

export interface IUserState {
  username?: string
  avatar?: string
  role?: string
  lang?: string
  company?: string
}

const state: IUserState = {}

export default {
  state,
  mutations,
  actions
}
