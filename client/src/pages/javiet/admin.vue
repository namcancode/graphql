<template>
  <div>

    <Card title="Bộ Lọc">
      <div class="row">
        <Form-Element title="Tìm kiếm" size="col-xl-2 col-md-6">
          <el-input v-model="query.search" placeholder="Tìm theo tên, SĐT, UID"></el-input>
        </Form-Element>

        <Form-Element title="Ngày import" size="col-xl-4 col-md-6">
          <el-date-picker format="dd/MM/yyyy" v-model="query.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions" />
        </Form-Element>

        <Form-Element title="Bước" size="col-xl-2 col-md-6">
          <el-select v-model="query.engageStatus" multiple>
            <el-option v-for="(value, key) in listEngageStatus" :value="key" :label="value" :key="key" />
          </el-select>
        </Form-Element>

        <Form-Element title="Người chăm sóc" size="col-xl-2 col-md-6">
          <el-select v-model="query.recruiter" multiple>
            <el-option label="Chưa có" :value="''" />
            <el-option v-for="rec in listRecruiter" :label="rec" :value="rec" :key="rec" />
          </el-select>
        </Form-Element>

        <div class="col-xl-2 col-lg-6" style="margin-top:44px">
          <el-button @click="getListHistory" type="success"> <i class="el-icon-search"></i> Tìm kiếm</el-button>
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
              <el-table-column prop="method" label="Hình thức" width="100" />
              <el-table-column prop="content" label="Kết quả" />
              <el-table-column prop="note" label="Ghi chú cho iHR" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Ngày import" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt | date('dd/MM hh:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Người chăm sóc" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.recruiter" @change="updateRecruiter(scope.$index)">
              <el-option v-for="rec in listRecruiter" :value="rec" :label="rec" :key="rec" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.name" label="Họ và tên" width="140" />

        <el-table-column label="Trạng thái" width="180">
          <template slot-scope="scope">
            {{listEngageStatus[scope.row.engageStatus]}}
          </template>
        </el-table-column>

        <el-table-column label="Năm" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.applicant.birthday">{{ scope.row.applicant.birthday | date('dd/MM/yyyy') }}</span>
            <span v-else>{{ scope.row.applicant.yearOfBirth }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.phone" label="SĐT" width="110" />
        <el-table-column label="Facebook" width="120">
          <template slot-scope="scope">
            <a v-if="parseInt(scope.row.applicant.uid)" :href="`https://fb.com/${scope.row.applicant.uid}`" target="_blank">Trang cá nhân</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.note" label="Ghi chú" min-width="400">
          <template slot-scope="scope" class="text-center">
            <span>{{getTransformedNote(scope.row.applicant)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.province" label="Tỉnh" width="120" />
        <el-table-column prop="applicant.page" label="Nguồn" width="100" />
      </el-table>
      <br />
      <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="query.page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="query.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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

interface IQuery {
  search?: string
  dateRange?: Date[]
  engageStatus?: number[]
  limit?: number
  page?: number
}

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
export default class JavietAdmin extends Vue {
  listHistory: any[] = []

  query = {} as IQuery
  total = 0

  loading = false
  listRecruiter = []
  listEngageStatus = ['0. Chưa liên lạc', '1. Đã liên lạc được', '2. Đã chốt lịch lên VP', '3. Đã lên VP', '4. Đã khám sức khỏe', '5 .Đã nộp cọc', '6. Dừng chăm sóc']

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
    this.loading = true
    Promise.all([this.getListHistory(), this.getListRecruiter()]).finally(() => (this.loading = false))
  }

  async getListHistory() {
    return request.post('javiet/list-applicant', this.query).then(rs => {
      this.listHistory = rs.data.docs
      this.query.limit = rs.data.limit
      this.query.page = rs.data.page
      this.total = rs.data.total
    })
  }

  async getListRecruiter() {
    return request.get('javiet/admin/list-recruiter').then(rs => {
      this.listRecruiter = rs.data
    })
  }

  update(index: number) {}

  updateRecruiter(index: number) {
    this.loading = true
    const history = this.listHistory[index]
    request
      .put(`javiet/admin/${history._id}`, history)
      .then(rs => {
        Notification.success('Đã cập nhật người chăm sóc')
      })
      .finally(() => (this.loading = false))
  }

  getTransformedNote(applicant: IApplicant) {
    return applicant.note ? applicant.note.replace(/(?:\r\n|\r|\n)/g, '. ') : ''
  }
}
</script>

