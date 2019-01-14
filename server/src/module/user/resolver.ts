import User, { getCryptPassword } from '@/model/User'
import { Context } from 'koa'
import { isEmpty } from 'lodash'

export const userQuery = {
  async users(parent, { filter }) {
    const query = {} as any

    if (filter.search) {
      query.username = { $regex: new RegExp(`${filter.search}`, 'g') }
    }

    if (filter.role && !isEmpty(filter.role)) {
      query.role = { $in: filter.role }
    }

    if (filter.company && !isEmpty(filter.company)) {
      query.$or = []
      filter.company.forEach(company => {
        query.$or.push({ role: new RegExp(`^${company}_.*`, 'i') })
      })
    }

    return await User.find(query).lean()
  },
  async user(parent, { id }) {
    return await User.findById({ _id: id }).lean()
  }
}

export const userMutation = {
  async loginAs(parent, { userId }, ctx: Context) {
    const user = await User.findById(userId)
    ctx.session.auth = user
    return user
  },

  async delete(parent, { userId }) {
    await User.deleteOne({ _id: userId })
  },

  async create(parent, { data }) {
    await User.create(data)
  },

  async update(parent, { userId, data }) {
    await User.updateOne({ _id: userId }, data)
  }
}

export const userMapper = {
  User: {
    company(user) {
      const [company, role] = user.role.split('_')
      return role ? company : null
    },
    id(user) {
      return user._id.toString()
    }
  }
}
