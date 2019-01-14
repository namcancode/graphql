import { sumBy, each, groupBy, mapValues, map, uniq, filter, find } from 'lodash'
import { eachDayOfInterval, format } from 'date-fns'

interface OverviewResponse extends Array<{ _id: string; count: number }> {}
export function mapOverviewData(rsData: OverviewResponse) {
  let data: any = {}
  rsData.forEach(status => {
    data[status._id] = status.count
  })
  data['total'] = sumBy(rsData, 'count')

  return data
}

interface LeadResponse {
  available: {
    [date: string]: number // date: 20181225
  }
  in_progress: {
    [date: string]: number // date: 20181225
  }
  not_available: {
    [date: string]: number // date: 20181225
  }
}

export function mapLeadData(rsData: LeadResponse, dateRange: Date[]) {
  const listDate = eachDayOfInterval({ start: dateRange[0], end: dateRange[1] })
  let labels = listDate.map(date => format(date, 'dd/MM'))
  let series: Array<Array<number>> = [[], [], [], []]

  rsData = Object.assign({ available: [], in_progress: [], not_available: [] }, rsData)

  each(listDate, date => {
    let yyyyMMddFormat = format(date, 'yyyyMMdd')
    let available = rsData.available[yyyyMMddFormat] || 0
    let inProgress = rsData.in_progress[yyyyMMddFormat] || 0
    let notAvailable = rsData.not_available[yyyyMMddFormat] || 0
    series[0].push(available + inProgress + notAvailable)
    series[1].push(inProgress)
    series[2].push(notAvailable)
    series[3].push(available)
  })

  return {
    labels,
    series
  }
}

interface SourceData extends Array<{ count: number; _id: { source: string; status: string } }> {}
export function mapSourceData(rsData: SourceData) {
  const labels = uniq(map(rsData, it => it._id.source))

  return {
    labels,
    chartData: mapValues({ all: '', available: '', not_available: '', in_progress: '' }, (value, status) => {
      return {
        series: map(labels, source => {
          if (status === 'all') {
            return sumBy(rsData, it => (it._id.source === source ? it.count : 0))
          }
          let el = find(rsData, { _id: { source, status } })
          return el ? el.count : 0
        })
      }
    })
  }
}
