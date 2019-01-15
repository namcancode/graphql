<template>
  <div>
    <Card :title="$t('Bộ Lọc')" clas="filter">
      <div class="row">
        <Form-Element title="Tìm kiếm" size="col-md-6 col-xl-3">
          <el-input v-model="filter.filterApplicant.name" placeholder="Tìm theo tên, SĐT, CMT"></el-input>
        </Form-Element>
        <Form-Element title="Người chăm sóc" size="col-xl-2 col-md-6">
          <el-select v-model="filter.telesale" multiple>
            <el-option label="Chưa có" value/>
            <el-option v-for="rec in listTelesale" :label="rec" :value="rec" :key="rec"/>
          </el-select>
        </Form-Element>
        <Form-Element title="Trạng thái Lead" size="col-xl-2 col-md-6">
          <el-select v-model="filter.telesaleStatus" multiple>
            <el-option v-for="status in listTelesaleStatus" :label="status" :value="status === 'Chưa có' ? '' : status" :key="status"/>
          </el-select>
        </Form-Element>
        <Form-Element title="Trạng thái cuộc gọi" size="col-xl-2 col-md-6">
          <el-select v-model="filter.filterTinhLoiEngage.callStatus" multiple>
            <el-option v-for="status in listCallStatus" :label="status" :value="status" :key="status"/>
          </el-select>
        </Form-Element>

        <Form-Element size="col-md-6 col-xl-3" title="Ngày phỏng vấn">
          <el-date-picker v-model="filter.interviewDate" type="daterange" align="right" unlink-panels range-separator="To" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="interviewDateOptions" format="dd/MM/yyyy"></el-date-picker>
        </Form-Element>
        <Form-Element size="col-md-6 col-xl-3" title="Ngày gọi lại">
          <el-date-picker v-model="filter.callBackTime" type="daterange" align="right" unlink-panels range-separator="To" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="callBackTimeOptions" format="dd/MM/yyyy"></el-date-picker>
        </Form-Element>
        <Form-Element size="col-md-6 col-xl-3" title="Ngày nhập ứng viên">
          <el-date-picker v-model="filter.createdAt" type="daterange" align="right" unlink-panels range-separator="To" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="interviewDateOptions" format="dd/MM/yyyy"></el-date-picker>
        </Form-Element>
        <Form-Element title="Nguồn" size="col-xl-1 col-md-6">
          <el-select v-model="filter.source">
            <el-option label="Event" value="event"/>
            <el-option label="Thường" value="normal"/>
            <el-option label="Tất Cả" value/>
          </el-select>
        </Form-Element>

        <div class="col-lg-2 col-xs-2 col-md-3 col-xl-2 d-flex">
          <el-popover placement="top-start" title="Xóa bộ lọc và số trang" trigger="hover">
            <el-button @click="resetFilter" type="warning" icon="el-icon-close" style="width:100%;margin-top:45px" slot="reference"></el-button>
          </el-popover>
          <div class="col-lg-9 col-xs-9 col-md-9 col-xl-10">
            <el-button @click="getListApplicant" type="success" icon="el-icon-search" style="margin-top:45px;width:100%">Lọc ứng viên</el-button>
          </div>
        </div>
        <div class="col-lg-2 col-xs-2 col-md-3 col-xl-2">
          <el-button @click="showApplicantDialog()" type="info" icon="el-icon-plus" style="margin-top:45px;width:100%">Thêm ứng viên</el-button>
        </div>
        <div class="col-lg-1 col-xs-1 col-md-3 col-xl-1">
          <el-button @click="exportToExcel" icon="el-icon-download" type="info" style="margin-top:45px;width:100%">Export</el-button>
        </div>
      </div>
    </Card>
    <Card v-loading="loading">
      <el-table border :data="listApplicant" class="w100 ttc">
        <el-table-column label="STT" width="50">
          <template slot-scope="scope">
            <b>{{ scope.$index + 1 + (pagination.page - 1) * pagination.limit}}</b>
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
              <el-table-column label="Giờ gọi lại" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.callBackTime | date('HH:mm dd/MM') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="note" label="Ghi chú"/>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="Action" width="100">
          <template slot-scope="scope">
            <el-tooltip content="Sửa tư vấn" placement="top">
              <el-button @click="goToDetailPage(scope.row._id)" icon="ti-headphone" circle type="warning" size="small"/>
            </el-tooltip>
            <el-tooltip content="Sửa thông tin ứng viên" placement="top">
              <el-button @click="showApplicantDialog(scope.row.applicant)" icon="ti-user" circle type="primary" size="small"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="Level" width="110">
          <template slot-scope="scope">
            <el-select v-model="scope.row.status" @change="update(scope.$index)" slot="reference">
              <el-option v-for="(value, key) in listStatus" :value="key+3" :label="value" :key="key"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái Lead" width="180">
          <template slot-scope="scope">
            <el-select v-model="scope.row.telesaleStatus" @change="update(scope.$index)" slot="reference" class="lead-status">
              <el-option v-for="(value, key) in listTelesaleStatus" :value="value" :label="value" :key="key" :disabled="value === 'Chưa có'" :style="value ==='Chưa có' ? 'display: none' :''"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Ngày phỏng vấn" width="200">
          <template slot-scope="scope">
            <el-date-picker v-model="scope.row.interviewDate" type="date" placeholder="Ngày phỏng vấn" format="dd/MM/yyyy" @change="update(scope.$index)"/>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái cuộc gọi" width="160">
          <!-- <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.listEngage[scope.row.listEngage.length - 1] ? scope.row.listEngage[scope.row.listEngage.length - 1].callStatus : ''}}</span>
          </template> -->
           <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.listEngage}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.name" label="Họ và tên" min-width="160"/>
        <el-table-column prop="applicant.gender" label="Giới tính" width="100"/>
        <el-table-column label="Ngày sinh" min-width="150">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.applicant.birthday | date('dd/MM/yyyy') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="SĐT" width="110">
          <template slot-scope="scope">
            <a @click.prevent="openCallPopup(scope.row.applicant)" href="#">{{ scope.row.applicant.phone }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="applicant.identityNumber" label="CMND" min-width="150"/>
        <el-table-column prop="applicant.province" label="Tỉnh" width="120"/>
        <el-table-column prop="telesale" label="Người chăm sóc" width="150"/>
        <el-table-column prop="applicant.note" label="Ghi chú" min-width="300"></el-table-column>
        <el-table-column prop="interviewStatus" label="Kết Quả Phỏng Vấn" min-width="160"/>
        <el-table-column prop="offerStatus" label="Kết quả Offer" min-width="150"/>
      </el-table>
      <br>
      <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="pagination.page" :page-sizes="[20, 50, 100, 200]" :page-size="pagination.limit" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
    </Card>

    <DialogApplicantForm :dialogVisible="dialogVisible.applicantDialog" @newApplicant="getListApplicant"></DialogApplicantForm>
    <el-dialog title="Hãy kiểm tra đầy đủ thông tin trước khi cập nhật" :visible.sync="dialogVisible.statusDialog.visible" width="30%" append-to-body>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.statusDialog.visible = false">Hủy</el-button>
        <el-button type="primary" @click="dialogVisible.statusDialog.confirm = true">Tiếp tục</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Card, DialogApplicantForm } from '@/components/index.ts'
import { Notification } from 'element-ui'
import request from '@/plugins/request'
import { IApplicant, LIST_PROVINCE } from '@/interface/Applicant'
import { pick, omit } from 'lodash'
import jwt from 'jsonwebtoken'
import { subMonths, subDays, startOfWeek, endOfWeek, addDays } from 'date-fns'
import { LIST_STATUS, LIST_CALL_STATUS, LIST_TELESALE_STATUS } from '@/interface/TinhLoi'
import MainVue from '@/components/Main.vue'
const lockr = require('lockr')
import { listApplicant } from '@/apollo/tinhloi/TinhLoiQuery'

interface Filter {
  interviewDate: Date[]
  offerStatus: string[]
  interviewStatus: string[]
  screeningStatus: string[]
  telesale: string[]
  telesaleStatus: string[]
  createdAt: Date[]
  filterApplicant: {
    name: string
    source: string
  }
  filterTinhLoiEngage: {
    callBackTime: Date[]
    callStatus: string[]
  }
}

const FILTER_DEFAULT = {
  interviewDate: [],
  offerStatus: [],
  interviewStatus: [],
  screeningStatus: [],
  telesale: [],
  telesaleStatus: [],
  createdAt: [],
  filterApplicant: {
    name: '',
    source: ''
  },
  filterTinhLoiEngage: {
    callBackTime: [],
    callStatus: []
  }
}

const PAGINATION_DEFAULT = {
  limit: 20,
  page: 1,
  total: 1
}
const localStorageKey = {
  telesale_filter: 'telesale_tinhloi_filter',
  telesale_page: 'telesale_tinhloi_page'
}

@Component({
  components: {
    DialogApplicantForm
  },
  apollo: {
    list() {
      return {
        query: listApplicant,
        variables: {
          filter: this.filter,
          pagination: this.pagination
        },
        result: rs => {
          this.listApplicant = this.sortListApplicant(rs.data.list.docs)
          this.pagination.limit = rs.data.list.limit
          this.pagination.page = rs.data.list.page
          this.pagination.total = rs.data.list.total
        }
      }
    }
  }
})
export default class TinhLoi extends MainVue {
  listApplicant: any[] = []

  pagination = { ...PAGINATION_DEFAULT }

  dialogVisible = {
    applicantDialog: {
      visible: false,
      applicant: {},
      titleButton: ''
    },
    statusDialog: {
      visible: false,
      confirm: false
    }
  }

  filter: Filter = { ...FILTER_DEFAULT }
  listStatus = LIST_STATUS
  listTelesaleStatus = LIST_TELESALE_STATUS
  listProvince = LIST_PROVINCE
  listCallStatus = LIST_CALL_STATUS
  listTelesale = []

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
          text: this.$t('3 tháng gần đây'),
          onClick(picker: any) {
            picker.$emit('pick', [subMonths(today, 3), today])
          }
        }
      ]
    }
  }

  get callBackTimeOptions() {
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
          text: this.$t('Ngày mai'),
          onClick(picker: any) {
            picker.$emit('pick', [addDays(today, 1), addDays(today, 1)])
          }
        },
        {
          text: this.$t('Ngày kia'),
          onClick(picker: any) {
            picker.$emit('pick', [addDays(today, 2), addDays(today, 2)])
          }
        }
      ]
    }
  }
  get loading(): boolean {
    return this.$apollo.queries.list.loading
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
    this.filter = this.getFilterFromLocal()
    this.pagination = this.getPagingFromLocal()
    this.getListApplicant()
    // Promise.all([this.getListApplicant(), this.getListTelesale()]).finally(() => this.stopLoading)
  }

  getListApplicant() {
    this.storeFilterToLocal()
    this.$apollo.queries.list.refetch().then(() => {
      this.fillBackgroundColor()
    })
  }

  async getListTelesale() {
    return request.get('tinhloi/list-telesale').then(rs => {
      this.listTelesale = rs.data
    })
  }

  update(index: number) {
    const applicantHistory = omit(this.listApplicant[index], ['applicant'])

    request.put(`tinhloi/${applicantHistory._id}`, applicantHistory).then(rs => {
      Notification.success('Đã cập nhật thông tin ứng viên')
    })
  }

  goToDetailPage(historyId: string) {
    this.$router.push({
      name: 'tinhloiDetail',
      params: { historyId }
    })
  }

  showApplicantDialog(applicant: IApplicant) {
    this.dialogVisible.applicantDialog.applicant = applicant || {}
    applicant ? (this.dialogVisible.applicantDialog.titleButton = 'Cập nhật') : (this.dialogVisible.applicantDialog.titleButton = 'Thêm ứng viên')
    this.dialogVisible.applicantDialog.visible = true
  }

  fillBackgroundColor() {
    document.querySelectorAll('.lead-status input').forEach((e: any) => {
      e.style.backgroundColor = '#ffffff'
      e.style.color = '#606266'

      if (e.value === LIST_TELESALE_STATUS[1]) {
        e.style.backgroundColor = '#67C23A'
        e.style.color = '#fff'
      }

      if (e.value === LIST_TELESALE_STATUS[2]) {
        e.style.backgroundColor = '#E6A23C'
        e.style.color = '#fff'
      }

      if (e.value === LIST_TELESALE_STATUS[3]) {
        e.style.backgroundColor = '#909399'
        e.style.color = '#fff'
      }

      if (e.value === LIST_TELESALE_STATUS[4]) {
        e.style.backgroundColor = '#F56C6C'
        e.style.color = '#fff'
      }
    })
  }

  storeFilterToLocal() {
    lockr.set(localStorageKey.telesale_filter, this.filter)
    lockr.set(localStorageKey.telesale_page, this.pagination)
  }

  getFilterFromLocal() {
    return lockr.get(localStorageKey.telesale_filter) || this.filter
  }

  getPagingFromLocal() {
    return lockr.get(localStorageKey.telesale_page) || this.pagination
  }

  resetFilter() {
    lockr.rm(localStorageKey.telesale_filter)
    lockr.rm(localStorageKey.telesale_page)

    this.filter = { ...FILTER_DEFAULT }

    this.pagination = { ...PAGINATION_DEFAULT }

    this.getListApplicant()
  }

  sortListApplicant(listApplicant: any[]) {
    const listSortApplicant: any[] = []

    listApplicant.forEach((applicant: any) => {
      if (applicant.telesaleStatus === '') {
        listSortApplicant.push(applicant)
      }
    })

    listApplicant.forEach((applicant: any) => {
      if (applicant.telesaleStatus === LIST_TELESALE_STATUS[1]) {
        listSortApplicant.push(applicant)
      }
    })

    listApplicant.forEach((applicant: any) => {
      if (applicant.telesaleStatus === LIST_TELESALE_STATUS[2]) {
        listSortApplicant.push(applicant)
      }
    })

    listApplicant.forEach((applicant: any) => {
      if (applicant.telesaleStatus === LIST_TELESALE_STATUS[3]) {
        listSortApplicant.push(applicant)
      }
    })

    listApplicant.forEach((doc: any) => {
      if (doc.telesaleStatus === LIST_TELESALE_STATUS[4]) {
        listSortApplicant.push(doc)
      }
    })

    return listSortApplicant
  }

  openCallPopup(applicant: IApplicant) {
    const ipphone = this.user.username === 'haptt' ? '8240' : '8241'
    const token = jwt.sign({ ipphone, iat: Math.floor(Date.now() / 1000 - 300) }, 'vFNtqjDVnJQ9E6k', { algorithm: 'HS256' })
    const url = `https://c2c.caresoft.vn/ihrsolution/c2call?token=${token}&number=${applicant.phone}`
    PopupCenter(url, applicant.name, 800, 600)
  }

  exportToExcel() {
    request({
      url: 'tinhloi/export-telesale',
      method: 'POST',
      data: { filter: this.filter },
      responseType: 'blob'
    }).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      const time = new Date().toLocaleString()
      link.setAttribute('download', `export_telesale_${time}.xlsx`)
      document.body.appendChild(link)
      link.click()
    })
  }
}

function PopupCenter(url: string, title: string, w: number, h: number) {
  const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX
  const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY

  const width = window.innerWidth ? window.innerWidth : document!.documentElement!.clientWidth ? document!.documentElement!.clientWidth : screen.width
  const height = window.innerHeight ? window.innerHeight : document!.documentElement!.clientHeight ? document!.documentElement!.clientHeight : screen.height

  const systemZoom = width / window.screen.availWidth
  const left = (width - w) / 2 / systemZoom + dualScreenLeft
  const top = (height - h) / 2 / systemZoom + dualScreenTop
  const newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left)

  if (window.focus && newWindow) newWindow.focus()
}
</script>

