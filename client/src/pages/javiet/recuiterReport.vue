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
      </div>

      <div class="col-12">
        <div class="row">
          <div class="col-4">
            <Chart-Card :title="'Tổng Quan: '+nameRec" chartType="Pie" :chartOptions="overviewOptions.Pie" :chartData="getChartPieDataByRec()" />
          </div>
          <div class="col-8">
            <Chart-Card :title="'Chi tiết: '+nameRec" chartType="Line" :chartOptions="overviewOptions.Line" :chartData="getChartLineDataByRec()" />
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
import MainVue from '@/components/Main.vue'

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
export default class RecuiterReport extends MainVue {
  filter = {}
  nameRec = ''
  loading = false
  rawData: JavietDoc[] = []
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
    this.loading = true
    this.nameRec = this.user.username as string
    this.getDataApplicant().then(() => {})
  }

  getChartLineDataByRec() {
    return getChartLineDataByRec(this.rawData, this.nameRec)
  }

  getChartPieDataByRec() {
    return getChartPieDataByRec(this.rawData, this.nameRec)
  }

  async getDataApplicant() {
    await request.post('javiet/list-applicant-recuiter', this.filter).then(async rs => {
      this.rawData = rs.data
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


