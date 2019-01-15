<template>
  <div id="operation-applicant">
    <Card :title="$t('Bộ Lọc')" clas="filter">
      <div class="row">
        <Form-Element title="Tìm kiếm" size="col-md-6 col-xl-3">
          <el-input v-model="filter.search" placeholder="Tìm theo tên, SĐT, CMT"></el-input>
        </Form-Element>
        <FormElement size="col-md-6 col-xl-3" title="Kết quả duyệt hồ sơ">
          <el-select v-model="filter.screeningStatus" multiple>
            <el-option label="chưa có kết quả" value></el-option>
            <el-option label="đạt" value="đạt"></el-option>
            <el-option label="loại" value="loại"></el-option>
          </el-select>
        </FormElement>
        <FormElement size="col-md-6 col-xl-4" title="Ngày phỏng vấn">
          <el-date-picker v-model="filter.interviewDate" type="daterange" align="right" unlink-panels range-separator="To" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="interviewDateOptions" format="dd/MM/yyyy"></el-date-picker>
        </FormElement>
        <FormElement size="col-md-6 col-xl-3" title="Kết quả phỏng vấn">
          <el-select v-model="filter.interviewStatus" multiple>
            <el-option label value="chưa có kết quả"></el-option>
            <el-option label="đạt" value="đạt"></el-option>
            <el-option label="loại" value="loại"></el-option>
            <el-option label="từ chối phỏng vấn" value="từ chối phỏng vấn"></el-option>
          </el-select>
        </FormElement>
        <FormElement size="col-md-6 col-xl-3" title="Kết quả offer">
          <el-select v-model="filter.offerStatus" multiple>
            <el-option label value="chưa có kết quả"></el-option>
            <el-option label="nhận offer" value="nhận offer"></el-option>
            <el-option label="không nhận offer" value="không nhận offer"></el-option>
          </el-select>
        </FormElement>
        <div class="col-lg-2 col-xs-2 col-md-3 col-xl-2">
          <el-button @click="getListApplicant" type="success" icon="el-icon-search" style="margin-top:45px;width:100%">Lọc ứng viên</el-button>
        </div>
        <div class="col-lg-2 col-xs-2 col-md-3 col-xl-2">
          <a :href="exportURL" role="button" icon="el-icon-download" class="btn btn-info" style="margin-top:45px;width:100%">Export</a>
        </div>
      </div>
    </Card>

    <Card v-loading="loading">
      
      <el-table border :data="listApplicant" style="width: 100%" class="ttc">
        <el-table-column label="STT" width="50">
          <template slot-scope="scope">
            <b>{{ scope.$index + 1 + (pagination.page - 1) * pagination.limit}}</b>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.name" label="Họ và tên" min-width="150"/>
        <el-table-column prop="applicant.gender" label="Giới tính" width="100"/>
        <el-table-column label="Ngày sinh" min-width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.applicant.birthday | date('dd/MM/yyyy') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.identityNumber" label="CMND" min-width="150"/>
        <el-table-column prop="applicant.phone" label="SĐT" min-width="150"/>
        <el-table-column prop="applicant.province" label="Tỉnh" min-width="150"/>
        <el-table-column label="Duyệt hồ sơ" min-width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.screeningStatus" @change="update(scope.$index)">
              <el-option label="đạt" value="đạt"></el-option>
              <el-option label="loại" value="loại"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Ngày phỏng vấn" min-width="150">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.interviewDate" type="date" placeholder="Ngày phỏng vấn" format="dd/MM/yyyy" @change="update(scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả phỏng vấn" min-width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.interviewStatus" placeholder="Kết quả" @change="update(scope.$index)">
              <el-option label="đạt" value="đạt"></el-option>
              <el-option label="loại" value="loại"></el-option>
              <el-option label="từ chối phỏng vấn" value="từ chối phỏng vấn"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả Offer" min-width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.offerStatus" @change="update(scope.$index)">
              <el-option label="nhận offer" value="nhận offer"></el-option>
              <el-option label="không nhận offer" value="không nhận offer"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="Ghi chú" min-width="200">
          <template slot-scope="scope">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="scope.row.note" @change="update(scope.$index)"/>
          </template>
        </el-table-column>
      </el-table>

      <br>
      <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="pagination.page" :page-sizes="[50, 100, 200, 500]" :page-size="pagination.limit" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
    </Card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index.ts'
import { Table, TableColumn, Pagination, DatePicker, Input, Option, Select, Button, Notification } from 'element-ui'
import request from '@/plugins/request'
import { subMonths, subDays, startOfMonth, endOfMonth, startOfWeek,endOfWeek } from 'date-fns'
import { omit } from 'lodash'
import { API_URL } from '@/config'

interface Filter {
  interviewDate: Date[]
  offerStatus: string[]
  interviewStatus: string[]
  screeningStatus: string[]
  company: string[]
}
@Component({
  components: {
    Card,
    FormElement,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Button.name]: Button
  }
})
export default class Tinhloi extends Vue {
  listApplicant: any[] = []

  pagination = {
    limit: 50,
    page: 1,
    total: 1
  }

  filter: Filter = {
    interviewDate: [],
    offerStatus: [],
    interviewStatus: [],
    screeningStatus: [],
    company: []
  }

  loading = false

  get interviewDateOptions() {
    const today = new Date()
    return {
      shortcuts: [
        {
          text: this.$t('Hôm nay'),
          onClick(picker: any) {
            picker.$emit('pick', [today, today])
          }
        },
        {
          text: this.$t('Tuần này'),
          onClick(picker: any) {
            picker.$emit('pick', [startOfWeek(today), endOfWeek(today)])
          }
        },
        {
          text: this.$t('Tháng này'),
          onClick(picker: any) {
            picker.$emit('pick', [startOfMonth(today), endOfMonth(today)])
          }
        }
      ]
    }
  }

  get exportURL() {
    return `${API_URL}/tinhloi/export`
  }

  changePage(page: number) {
    this.pagination.page = page
    this.getListApplicant()
  }

  changeLimit(limit: number) {
    this.pagination.limit = limit
    this.pagination.page = 1
    this.getListApplicant()
  }

  created() {
    this.getListApplicant()
  }

  getListApplicant() {
    this.loading = true
    request
      .post('tinhloi/list-applicant', { pagination: this.pagination, filter: this.filter })
      .then(rs => {
        this.listApplicant = rs.data.docs
        this.pagination.limit = rs.data.limit
        this.pagination.page = rs.data.page
        this.pagination.total = rs.data.total
      })
      .finally(this.stopLoading)
  }

  stopLoading() {
    this.loading = false
  }

  update(index: number) {
    const applicantHistory = omit(this.listApplicant[index], ['applicant'])
    request.put(`tinhloi/${applicantHistory._id}`, applicantHistory).then(rs => {
      Notification.success('Đã cập nhật thông tin ứng viên')
    })
  }
}
</script>
