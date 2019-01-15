import { Context } from 'koa'
import Applicant from '@/model/Applicant'
import { isEmpty, groupBy, mapValues } from 'lodash'
import { toDate, format } from 'date-fns'

interface Filter {
  dateRange: [Date, Date]
  sources: string[]
}

export default class MarketingReportController {
  static async overview(ctx: Context) {
    let $match = getQueryByFilter(<Filter>ctx.request.body)
    let $group = {
      _id: '$status',
      count: { $sum: 1 }
    }

    let listStatus = await Applicant.aggregate([{ $match }, { $group }])

    ctx.body = listStatus
  }

  static async lead(ctx: Context) {
    let query = getQueryByFilter(<Filter>ctx.request.body)
    let listApplicant = await Applicant.find(query).sort('createdAt')
    let groupByStatus = groupBy(listApplicant, 'status')

    let rs = mapValues(groupByStatus, listApplicant => {
      let groupByDate = groupBy(listApplicant, applicant => format(applicant.createdAt, 'yyyyMMdd'))
      return mapValues(groupByDate, it => it.length)
    })

    ctx.body = rs
  }

  static async source(ctx: Context) {
    const $match = getQueryByFilter(<Filter>ctx.request.body)
    const $group = {
      _id: { source: '$source', status: '$status' },
      count: { $sum: 1 }
    }
    const listSource = await Applicant.aggregate([{ $match }, { $group }])

    ctx.body = listSource
  }
}

function getQueryByFilter(filter: Filter) {
  let query = {
    createdAt: {
      $gte: toDate(filter.dateRange[0]),
      $lte: toDate(filter.dateRange[1])
    }
  }

  if (!isEmpty(filter.sources)) {
    query['source'] = {
      $in: filter.sources
    }
  }

  return query
}
