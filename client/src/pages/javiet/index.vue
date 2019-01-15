<template>
  <div>
    <Card title="Bộ Lọc">
      <div class="row">
        <Form-Element title="Tìm kiếm" size="col-xl-2 col-md-6">
          <el-input v-model="query.search" placeholder="Tìm theo tên, SĐT, UID"></el-input>
        </Form-Element>

        <Form-Element title="Ngày import" size="col-xl-4 col-md-6">
          <el-date-picker format="dd/MM/yyyy" v-model="query.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions"/>
        </Form-Element>

        <Form-Element title="Bước" size="col-xl-2 col-md-6">
          <el-select v-model="query.engageStatus" multiple>
            <el-option v-for="(value, key) in listEngageStatus" :value="key" :label="value" :key="key"/>
          </el-select>
        </Form-Element>

        <div class="col-xl-4 col-lg-6" style="margin-top:44px">
          <el-popover placement="top-start" title="Xóa bộ lọc và số trang" trigger="hover" style="margin-right:10px">
            <el-button @click="resetFilter" type="warning" icon="el-icon-close" slot="reference"></el-button>
          </el-popover>
          <el-button @click="getListHistory" type="success">
            <i class="el-icon-search"></i> Tìm kiếm
          </el-button>
          <el-button type="danger" @click.prevent="goToExportLink">
            <i class="el-icon-download"></i> Export
          </el-button>
        </div>
      </div>
    </Card>

    <Card v-loading="loading">
      <el-table border :data="listHistory" class="w100 ttc">
        <el-table-column label="STT" width="50">
          <template slot-scope="scope">
            <b>{{ scope.$index + 1 + (query.page - 1) * query.limit}}</b>
          </template>
        </el-table-column>
        <el-table-column type="expand">
          <template slot-scope="scopeApplicant">
            <el-table border :data="scopeApplicant.row.listEngage" style="width: 100%">
              <el-table-column width="120">
                <template slot-scope="scope">
                  <b>Tư vấn lần {{scope.$index + 1}}</b>
                </template>
              </el-table-column>
              <el-table-column label="Thời gian" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.createdAt | date('HH:mm dd/MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column label="Cập nhật" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.updatedAt | date('HH:mm dd/MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="method" label="Hình thức" width="100"/>
              <el-table-column prop="content" label="Kết quả"/>
              <el-table-column prop="note" label="Ghi chú cho iHR"/>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Tư vấn" width="60">
          <template slot-scope="scope">
            <el-button @click="goToDetailPage(scope.row._id)" icon="el-icon-edit" circle type="warning" size="small"/>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="200">
          <template slot-scope="scope">
            <el-popover placement="top-start" :title="scope.row.reasonEngageStop" trigger="hover" :disabled="scope.row.engageStatus !== 6">
              <el-button v-if="!scope.row.reasonEngageStop && !dialogFormVisible" type="info" icon="el-icon-edit" @click="update(scope.$index)">Thêm lý do</el-button>
              <el-button v-if="scope.row.reasonEngageStop" size="small" type="info" icon="el-icon-edit" @click="update(scope.$index)" circle></el-button>
              <el-select v-model="scope.row.engageStatus" @change="update(scope.$index)" slot="reference">
                <el-option v-for="(value, key) in listEngageStatus" :value="key" :label="value" :key="key"></el-option>
              </el-select>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="Ngày import" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | date('dd/MM hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.name" label="Họ và tên" width="140"/>
        <el-table-column label="Năm" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.applicant.birthday">{{ scope.row.applicant.birthday | date('dd/MM/yyyy') }}</span>
            <span v-else>{{ scope.row.applicant.yearOfBirth }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.phone" label="SĐT" width="110"/>
        <el-table-column label="Facebook" width="120">
          <template slot-scope="scope">
            <a v-if="parseInt(scope.row.applicant.uid)" :href="`https://fb.com/${scope.row.applicant.uid}`" target="_blank">Trang cá nhân</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.note" label="Ghi chú" min-width="160">
          <template slot-scope="scope" class="text-center">
            <span>{{getTransformedNote(scope.row.applicant)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Kết quả tư vấn" min-width="250">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.listEngage[scope.row.listEngage.length - 1] ? scope.row.listEngage[scope.row.listEngage.length - 1].content : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.province" label="Tỉnh" width="120"/>
        <el-table-column prop="applicant.page" label="Nguồn" width="100"/>
      </el-table>
      <br>
      <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="query.page" :page-sizes="[20, 50, 100, 200]" :page-size="query.limit" layout="total, sizes, prev, pager, next, jumper" :total="query.total"></el-pagination>

      <el-dialog title="Chọn lý do ứng viên bị dừng chăm sóc" :visible.sync="dialogFormVisible" :append-to-body="true">
        <el-form>
          <el-select v-model="reasonEngage.reason" placeholder="Hãy chọn một lý do">
            <el-option v-for="(value, key) in listStopReason" :value="value" :label="value" :key="key"/>
          </el-select>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">Hủy bỏ</el-button>
          <el-button type="primary" class="el-button el-button--success" @click="updateReasonEngageStop">Xác Nhận</el-button>
        </span>
      </el-dialog>
    </Card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index.ts'
import { Table, TableColumn, Pagination, Button, Notification, Input, Select, DatePicker, Option, Loading } from 'element-ui'
import request from '@/plugins/request'
import { subDays, subMonths } from 'date-fns'
import { IApplicant, IApplicantHistory } from '@/interface/Applicant'
import { assign, pick, map, toNumber, isEmpty, keys, omitBy } from 'lodash'
import { stringify, parse } from 'querystring'
import { toDate } from 'date-fns'
const lockr = require('lockr')

interface IQuery {
  search?: string
  dateRange?: Date[]
  engageStatus?: number[]
  limit?: number
  page?: number
  total?: number
}

interface IreasonEngage {
  historyIndex: number
  historyId: string
  reason: string
}

const QUERY_DEFAULT = {
  search: '',
  dateRange: [],
  engageStatus: [],
  limit: 20,
  page: 1,
  total: 1
}
const LocalStorageKey = 'Javiet_recuiter_filter'

import { JAVIET_STEP, JAVIET_STOP_REASON } from '@/interface/Javiet'
import { API_URL } from '@/config'

@Component({
  components: {
    Card,
    FormElement,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker
  }
})
export default class Javiet extends Vue {
  listHistory: any[] = []

  query: IQuery = { ...QUERY_DEFAULT }

  loading = false

  listEngageStatus = JAVIET_STEP
  listStopReason = JAVIET_STOP_REASON
  dialogFormVisible = false
  reasonEngage = {} as IreasonEngage

  goToExportLink() {
    window.location.href = API_URL + '/javiet/export-data'
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

  changePage(page: number) {
    this.query.page = page
    this.getListHistory()
  }

  changeLimit(limit: number) {
    this.query.limit = limit
    this.query.page = 1
    this.getListHistory()
  }

  created() {
    this.query = this.getFilterFromLocal()
    this.getListHistory()
  }

  getListHistory() {
    this.loading = true

    request
      .post('javiet/list-applicant', this.query)
      .then(rs => {
        this.listHistory = rs.data.docs
        this.query = assign(this.query, pick(rs.data, ['limit', 'page', 'total']))
      })
      .finally(() => {
        this.storeFilterToLocal()
        this.loading = false
      })
  }

  update(index: number) {
    const history = this.listHistory[index]

    if (history.engageStatus !== 6) {
      const loading = Loading.service({})

      request
        .put(`javiet/update-history-status`, {
          engageStatus: parseInt(history.engageStatus),
          historyId: history._id
        })
        .then(() => Notification.success('Cập nhật thành công'))
        .finally(() => loading.close())
    }

    if (history.engageStatus === 6) {
      this.reasonEngage.historyIndex = index
      this.reasonEngage.historyId = history._id
      this.dialogFormVisible = true
    }
  }

  updateReasonEngageStop() {
    if (!this.reasonEngage.reason) {
      return Notification.error('Bạn phải chọn 1 lý do')
    }

    return request.post(`javiet/reason-engage-stop`, this.reasonEngage).then(() => {
      this.dialogFormVisible = false
      this.listHistory[this.reasonEngage.historyIndex].reasonEngageStop = this.reasonEngage.reason
      Notification.success('Đã cập nhật lý do thành công')
    })
  }

  updateApplicant(index: number) {
    const { applicant } = this.listHistory[index]
    const loading = Loading.service({})
    request
      .put(`javiet/update-applicant-status`, {
        status: applicant.status,
        applicantId: applicant._id
      })
      .then(() => Notification.success('Cập nhật thành công'))
      .finally(() => loading.close())
  }

  getTransformedNote(applicant: IApplicant) {
    return applicant.note ? applicant.note.replace(/(?:\r\n|\r|\n)/g, '. ') : ''
  }

  goToDetailPage(historyId: string) {
    this.$router.push({
      name: 'javietDetail',
      params: { historyId }
    })
  }

  storeFilterToLocal() {
    lockr.set(LocalStorageKey, this.query)
  }

  getFilterFromLocal() {
    return lockr.get(LocalStorageKey) || this.query
  }

  resetFilter() {
    lockr.rm(LocalStorageKey)

    this.query = { ...QUERY_DEFAULT }

    this.getListHistory()
  }
}
</script>


