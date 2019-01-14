<template>
    <div id="marketing-report">
        <card title="Bộ Lọc">
            <div class="row">
                <Form-Element title="Ngày đăng ký" size="col-xl-4 col-sm-6">
                    <el-date-picker format="dd/MM/yyyy" v-model="filter.dateRange" type="daterange" align="right" unlink-panels range-separator="T" :start-placeholder="$t('Ngày bắt đầu')" :end-placeholder="$t('Ngày kết thúc')" :picker-options="dateOptions" />
                </Form-Element>
                <Form-Element title="Nguồn" size="col-xl-4 col-sm-6">
                    <el-select multiple class="select-primary" size="large" v-model="filter.sources" :placeholder="$t('Nguồn')">
                        <el-option v-for="source in listSource" class="select-primary" :value="source" :label="source" :key="source"></el-option>
                    </el-select>
                </Form-Element>

                <div class="col-xl-4 col-sm-6" style="margin-top: 44px">
                    <button @click="submit" type="button" class="btn btn-wd btn-info btn-fill">
                        {{$t('Lọc')}}
                    </button>
                </div>
            </div>

            <div class="stats" slot="footer">
                <i class="ti-filter"></i> {{$t('Bộ lọc dùng chung cho các biểu đồ dưới đây')}}
            </div>
        </card>
        <div class="row">
            <div class="col-md-6 col-xl-3">
                <stats-card>
                    <div class="icon-big text-center icon-warning" slot="header">
                        <i class="ti-server"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{$t('Tổng ứng viên')}}</p> {{overviewData.total}}
                    </div>
                    <div class="stats" slot="footer">
                        <i class="ti-reload"></i> {{$t('số lượng ứng viên đang có trong database')}}
                    </div>
                </stats-card>
            </div>
            <div class="col-md-6 col-xl-3">
                <stats-card>
                    <div class="icon-big text-center icon-success" slot="header">
                        <i class="ti-wallet"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{$t('Ứng viên chưa đi làm')}}</p> {{overviewData.available}}
                    </div>
                    <div class="stats" slot="footer">
                        <i class="ti-calendar"></i> {{$t('ứng viên đang available')}}
                    </div>
                </stats-card>
            </div>
            <div class="col-md-6 col-xl-3">
                <stats-card>
                    <div class="icon-big text-center icon-danger" slot="header">
                        <i class="ti-pulse"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{$t('Ứng viên chờ phỏng vấn')}}</p> {{overviewData['in_progress']}}
                    </div>
                    <div class="stats" slot="footer">
                        <i class="ti-timer"></i> {{$t('ứng viên đã chuyển cho đối tác và đang chờ kết quả')}}
                    </div>
                </stats-card>
            </div>
            <div class="col-md-6 col-xl-3">
                <stats-card>
                    <div class="icon-big text-center icon-info" slot="header">
                        <i class="ti-twitter-alt"></i>
                    </div>
                    <div class="numbers" slot="content">
                        <p>{{$t('Ứng viên convert thành công')}}</p> {{overviewData['not_available']}}
                    </div>
                    <div class="stats" slot="footer">
                        <i class="ti-reload"></i> {{$t('ứng viên đi làm tại các công ty của đối tác')}}
                    </div>
                </stats-card>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <chart-card :title="$t('Lượng ứng viên')" :sub-title="$t('Lượng lead đổ về theo ngày')" :chart-data="leadData" :chart-options="options" chart-type="Line">
                    <span slot="footer">
                        <i class="ti-layout-grid3-alt" style="color: #68B3C8"></i> ALL
                        <i class="ti-layout-grid3-alt" style="color: #F3BB45"></i> AVAILABLE
                    </span>
                </chart-card>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <chart-card :title="$t('Tỉ lệ chuyển đổi ứng viên')" :sub-title="$t('Tính theo ngày lead về')" :chart-options="{seriesBarDistance: 10}" :chart-data="cvrData" chart-type="Bar">
                    <span slot="footer">
                        <i class="ti-layout-grid3-alt" style="color: #68B3C8"></i> ALL
                        <i class="ti-layout-grid3-alt" style="color: #F3BB45"></i> IN PROGRESS
                        <i class="ti-layout-grid3-alt" style="color: #EB5E28"></i> PASS
                    </span>
                </chart-card>
            </div>
        </div>

        <div class="row" v-if="sourceData">
            <div class="col-sm-12 col-md-4">
                <chart-card :title="$t('Nguồn ứng viên')" :sub-title="$t('Tất cả lead')" :chart-data="sourceData.all" chart-type="Pie">
                    <span slot="footer">
                        <i class="ti-layout-grid3-alt" style="color: #68B3C8"></i> {{sourceLabels[0]}}
                        <i class="ti-layout-grid3-alt" style="color: #F3BB45"></i> {{sourceLabels[1]}}
                    </span>
                </chart-card>
            </div>
            <div class="col-sm-12 col-md-4">
                <chart-card :title="$t('Nguồn ứng viên')" :sub-title="$t('Ứng viên đang process')" :chart-data="sourceData.in_progress" chart-type="Pie">
                    <span slot="footer">
                        <i class="ti-layout-grid3-alt" style="color: #68B3C8"></i> {{sourceLabels[0]}}
                        <i class="ti-layout-grid3-alt" style="color: #F3BB45"></i> {{sourceLabels[1]}}
                    </span>
                </chart-card>
            </div>
            <div class="col-sm-12 col-md-4">
                <chart-card :title="$t('Nguồn ứng viên')" :sub-title="$t('Ứng viên Pass')" :chart-data="sourceData.not_available" chart-type="Pie">
                    <span slot="footer">
                        <i class="ti-layout-grid3-alt" style="color: #68B3C8"></i> {{sourceLabels[0]}}
                        <i class="ti-layout-grid3-alt" style="color: #F3BB45"></i> {{sourceLabels[1]}}
                    </span>
                </chart-card>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { StatsCard, ChartCard, Card, FormElement } from '@/components/index'
import Chartist from 'chartist'
import { DatePicker, TimeSelect, Slider, Tag, Input, Button, Select, Option } from 'element-ui'
import { subDays, subMonths, subYears, subWeeks } from 'date-fns'
import request from '@/plugins/request'
import { mapOverviewData, mapLeadData, mapSourceData } from '@/mapper/marketing/report'
import { ctPointLabels } from '@/plugins/chartist'

@Component({
  components: {
    ChartCard,
    StatsCard,
    Card,
    FormElement,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option
  }
})
export default class MarketingReport extends Vue {
  listSource = []

  filter = {
    dateRange: [subMonths(new Date(), 1), new Date()],
    sources: []
  }

  overviewData: any = {}

  get dateOptions() {
    const today = new Date()
    return {
      shortcuts: [
        {
          text: this.$t('3 ngày gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subDays(today, 3), today])
          }
        },
        {
          text: this.$t('1 tuần gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subDays(today, 7), today])
          }
        },
        {
          text: this.$t('1 tháng gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subMonths(today, 1), today])
          }
        },
        {
          text: this.$t('3 tháng gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subMonths(today, 3), today])
          }
        }
      ]
    }
  }

  leadData: { labels: string[]; series: number[][] } = { labels: [], series: [] }

  cvrData: { labels: string[]; series: number[][] } = { labels: [], series: [] }

  options = {
    seriesBarDistance: 5,
    plugins: [ctPointLabels()]
  }

  sourceData: any = null
  sourceLabels: string[] = []

  created() {
    request.get('marketing/list-source').then(rs => {
      this.listSource = rs.data
      this.submit()
    })
  }

  submit() {
    request.post('marketing/report/overview', this.filter).then(rs => {
      this.overviewData = mapOverviewData(rs.data)
      this.$forceUpdate()
    })
    request.post('marketing/report/lead', this.filter).then(rs => {
      const allData = mapLeadData(rs.data, this.filter.dateRange)
      this.cvrData = {
        labels: allData.labels,
        series: [allData.series[0], allData.series[1], allData.series[2]]
      }
      this.leadData = {
        labels: allData.labels,
        series: [allData.series[0], allData.series[3]]
      }
      this.$forceUpdate()
    })
    request.post('marketing/report/source', this.filter).then(rs => {
      const mapperData = mapSourceData(rs.data)
      this.sourceData = mapperData.chartData
      this.sourceLabels = mapperData.labels
    })
  }
}
</script>

<style lang="scss" scoped>
#marketing-report {
  .numbers {
    span {
      font-size: 16px;
    }
  }
}
</style>
