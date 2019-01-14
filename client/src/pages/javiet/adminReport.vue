<template>
  <div>

    <Card title="Bộ Lọc">
      <div class="row">

        <Form-Element title="Ngày ứng viên thêm vào" size="col-xl-4 col-md-6">
          <el-date-picker format="dd/MM/yyyy" v-model="filter.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions" />
        </Form-Element>

        <div class="col-xl-2 col-lg-6" style="margin-top:44px">
          <el-button type="success" @click="getDataApplicant"> <i class="el-icon-search"></i> Tìm kiếm</el-button>
        </div>
      </div>
    </Card>

    <div class="row">
      <div class="col-12">
        <div class="list-annotation row col-8 mb-3">
          <ul class="list-group col-xl-3 col-md-4 col-sm-6">
            <li class="list-group-item list_item_1 "><em>Chưa liên lạc</em></li>
          </ul>
          <ul class="list-group col-xl-3 col-md-4 col-sm-6">
            <li class="list-group-item list_item_3 "><em>Đang chăm sóc</em></li>
          </ul>
          <ul class="list-group col-xl-3 col-md-4 col-sm-6">
            <li class="list-group-item list_item_2 "><em>Dừng chăm sóc</em></li>
          </ul>
        </div>

        <div class="row" v-if="admin">
          <div class="col-4">
            <Chart-Card title="Tổng Quan" chartType="Pie" :chartOptions="overviewOptions.Pie" :chartData="overviewData.Pie" />
          </div>
          <div class="col-8">
            <Chart-Card title="Chi Tiết" chartType="Line" :chartOptions="overviewOptions.Line" :chartData="overviewData.Line" />
          </div>
        </div>
      </div>

      <div class="col-12" v-if="admin">
        <div class="row" v-for="(rec, index) in listRec" :key="index">
          <div class="col-4">
            <Chart-Card :title="'Tổng Quan: '+rec" chartType="Pie" :chartOptions="overviewOptions.Pie" :chartData="getChartPieDataByRec(rec)" />
          </div>
          <div class="col-8">
            <Chart-Card :title="'Chi tiết: '+rec" chartType="Line" :chartOptions="overviewOptions.Line" :chartData="getChartLineDataByRec(rec)" />
          </div>
        </div>
      </div>
      <div class="col-12" v-else>
        <div class="row">
          <div class="col-4">
            <Chart-Card :title="'Tổng Quan: '+listRec" chartType="Pie" :chartOptions="overviewOptions.Pie" :chartData="getChartPieDataByRec(listRec)" />
          </div>
          <div class="col-8">
            <Chart-Card :title="'Chi tiết: '+listRec" chartType="Line" :chartOptions="overviewOptions.Line" :chartData="getChartLineDataByRec(listRec)" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement, ChartCard } from '@/components/index.ts'
import { Button, Notification, Input, Select, DatePicker, Option, Loading } from 'element-ui'
import request from '@/plugins/request'
import { subDays, subMonths } from 'date-fns'
import { IApplicant, IApplicantHistory } from '@/interface/Applicant'
import { getOverviewChartLineData, getChartLineDataByRec, getOverviewChartPieData, getChartPieDataByRec } from '@/mapper/javietReport'
import { JavietDoc } from '@/interface/Javiet'
import { ctPointLabels, ratioLabels } from '@/plugins/chartist'

@Component({
  components: {
    Card,
    ChartCard,
    FormElement,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker
  }
})
export default class JavietReport extends Vue {
  filter = {}
  listRec = []
  admin = true
  loading = false
  rawData: JavietDoc[] = []
  overviewData = {
    Line: {},
    Pie: {}
  }
  overviewOptions = {
    Line: {
      low: 0,
      showArea: true,
      chartPadding: {
        top: 25
      },
      plugins: [ctPointLabels(), ratioLabels()]
    },
    Pie: {
      showLabel: true,
      ignoreEmptyValues: true
    }
  }

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

  created() {
    this.admin = this.$route.meta.role.includes('javiet_admin') ? true : false
    this.loading = true
    this.getDataApplicant().then(() => {})
  }

  async getListRec() {
    return request.get('javiet/admin/list-recruiter').then(rs => {
      this.listRec = rs.data
    })
  }

  getChartLineDataByRec(rec: string) {
    return getChartLineDataByRec(this.rawData, rec)
  }
  getChartPieDataByRec(rec: string) {
    return getChartPieDataByRec(this.rawData, rec)
  }

  async getDataApplicant() {
    return request.post('javiet/admin/list-applicant', this.filter).then(async rs => {
      this.rawData = rs.data
      await this.getListRec()
      this.overviewData.Line = getOverviewChartLineData(this.rawData)
      this.overviewData.Pie = getOverviewChartPieData(this.rawData)
    })
  }
}
</script>
<style>
.point-label {
  fill: rgb(252, 143, 0);
  font-size: 14px;
}
.ratio-label {
  fill: rgb(207, 5, 22);
}
.list_item_1 {
  background-color: #68b3c8;
  color: #ffffff;
}
.list_item_2 {
  background-color: #eb5e28;
  color: #ffffff;
}
.list_item_3 {
  background-color: #f3bb45;
  color: #2b2b2b;
}
.ct-label {
  padding-top: 12px;
}
.ct-chart-line {
  height: 103%;
}
</style>


