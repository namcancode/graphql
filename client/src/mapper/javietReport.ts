import { JavietDoc, JAVIET_STEP } from '@/interface/Javiet'
import { groupBy, mapValues, map, assign, Dictionary, slice, sum, filter, dropRight, countBy, mapKeys, keys, values } from 'lodash'

export function getOverviewChartLineData(rawData: JavietDoc[]) {
  const intitDataByStep = mapValues(JAVIET_STEP, it => []) as Dictionary<JavietDoc[]>

  const groupByStep = assign(intitDataByStep, groupBy(rawData, 'engageStatus'))

  const countByStep = map(groupByStep, listDoc => listDoc.length)

  const removeStepSix = dropRight(countByStep)

  const funnelData = map(removeStepSix, (count, step) => sum(slice(removeStepSix, step - removeStepSix.length)))

  return {
    labels: dropRight(JAVIET_STEP),
    series: [funnelData]
  }
}

export function getChartLineDataByRec(rawData: JavietDoc[], rec: string) {
  return getOverviewChartLineData(filter(rawData, it => it.recruiter === rec))
}

export function getOverviewChartPieData(rawData: JavietDoc[]) {
  const intitDataByStep = mapValues(JAVIET_STEP, it => []) as Dictionary<JavietDoc[]>

  const groupByStep = assign(intitDataByStep, groupBy(rawData, 'engageStatus'))

  const countByStep = map(groupByStep, listDoc => listDoc.length)

  const data = [countByStep[0], countByStep[1] + countByStep[2] + countByStep[3] + countByStep[4] + countByStep[5], countByStep[6]]

  return {
    series: data
  }
}

export function getChartPieDataByRec(rawData: JavietDoc[], rec: string) {
  return getOverviewChartPieData(filter(rawData, it => it.recruiter === rec))
}

export function getOverviewChartBarData(rawData: JavietDoc[]) {
  const filterDataByEngageStatus = filter(rawData, engage => engage.engageStatus === 6)

  const initDataByReason = mapValues(filterDataByEngageStatus, 'reasonEngageStop')

  const countByReason = countBy(Object.values(initDataByReason))

  const dataAfterChangeNameKey = mapKeys(countByReason, (val: number, key: string) => {
    if (key === 'undefined') return (key = 'Không có lý do')
    return key
  })

  return {
    labels: keys(dataAfterChangeNameKey),
    series: [values(dataAfterChangeNameKey)]
  }
}

export function getChartBarDataByRec(rawData: JavietDoc[], rec: string) {
  return getOverviewChartBarData(filter(rawData, it => it.recruiter === rec))
}
