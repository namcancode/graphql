<template>
    <div>
        <Card title="Bộ Lọc">
            <div class="row">
                <Form-Element title="Tìm kiếm" size="col-xl-4 col-md-6">
                    <el-input v-model="filter.name" placeholder="Tìm theo tên, sđt, CMND"></el-input>
                </Form-Element>

                <Form-Element title="Ngày đăng ký" size="col-xl-4 col-md-6">
                    <el-date-picker format="dd/MM/yyyy" v-model="filter.dateRange" type="daterange" align="right" unlink-panels range-separator="T" start-placeholder="Ngày bắt đầu" end-placeholder="Ngày kết thúc" :picker-options="dateOptions" />
                </Form-Element>

                <Form-Element title="Tỉnh" size="col-xl-4 col-md-6">
                    <el-select v-model="filter.province" multiple filterable>
                        <el-option v-for="province in listProvince" :value="province" :label="province" :key="province" />
                    </el-select>
                </Form-Element>

                <Form-Element title="Nguồn" size="col-xl-4 col-md-6">
                    <el-select v-model="filter.source_id" multiple filterable>
                        <el-option v-for="source in listSource" :value="source" :label="source" :key="source" />
                    </el-select>
                </Form-Element>

                <Form-Element title="Giới tính" size="col-xl-2 col-md-6">
                    <el-select v-model="filter.gender" multiple>
                        <el-option value="Nam" label="Nam" />
                        <el-option value="Nữ" label="Nữ" />
                    </el-select>
                </Form-Element>

                <Form-Element title="Trạng thái" size="col-xl-2 col-md-6">
                    <el-select v-model="filter.status" multiple filterable>
                        <el-option v-for="status in listStatus" :value="status" :label="status" :key="status" />
                    </el-select>
                </Form-Element>
                <div class="col-xl-4 col-lg-6" style="margin-top:44px">
                    <el-button @click="getListApplicant" type="success"> <i class="el-icon-search"></i> Lọc</el-button>
                </div>
            </div>
        </Card>
        <Card>
            <el-table border :data="listApplicant" class="ttc full-width">
                <el-table-column label="STT" width="50">
                    <template slot-scope="scope">
                        <b>{{ scope.$index + 1 }}</b>
                    </template>
                </el-table-column>
                <el-table-column label="Công cụ" width="140">
                    <template slot-scope="scope">
                        <el-button @click="deleteApplicant(scope.$index)" icon="el-icon-delete" circle type="danger" size="small" />
                        <el-button @click="goToMessagePage(scope.$index)" icon="el-icon-message" circle type="info" size="small" />
                        <el-button @click="goToUpdatePage(scope.$index)" icon="el-icon-edit" circle type="primary" size="small" />
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="Họ và tên" min-width="150" />
                <el-table-column prop="gender" label="Giới tính" min-width="100"></el-table-column>
                <el-table-column label="Ngày sinh" min-width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.birthday">{{ scope.row.birthday | date('dd/MM/yyyy') }}</span>
                        <span v-else>{{ scope.row.yearOfBirth }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="SĐT" min-width="150" />
                <el-table-column prop="province" label="Tỉnh" min-width="120" />
                <el-table-column prop="status" label="Trạng thái" min-width="120" />
                <el-table-column prop="source" label="Nguồn" min-width="100" />
                <el-table-column prop="identityNumber" label="CMND" min-width="150" />
                <el-table-column label="Ngày đăng ký" min-width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.createdAt | date('dd/MM/yyyy HH:mm:ss') }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <br />
            <el-pagination @size-change="changeLimit" @current-change="changePage" :current-page.sync="pagination.page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="pagination.limit" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
        </Card>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index.ts'
import { Table, TableColumn, Pagination, Button, Notification, Input, Select, Option, DatePicker } from 'element-ui'
import request from '@/plugins/request'
import { LIST_PROVINCE, APPLICANT_STATUS } from '@/interface/Applicant'
import { values } from 'lodash'
import { subDays, subMonths } from 'date-fns'

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
export default class MarketingListApplicant extends Vue {
  listApplicant: any[] = []

  filter = {}

  listProvince = LIST_PROVINCE
  listSource = []
  listStatus = values(APPLICANT_STATUS)
  pagination = {
    limit: 10,
    page: 1,
    total: 1
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
    request.post('marketing/list-applicant', { filter: this.filter, pagination: this.pagination }).then(rs => {
      this.listApplicant = rs.data.docs
      this.pagination.limit = rs.data.limit
      this.pagination.page = rs.data.page
      this.pagination.total = rs.data.total
    })
  }

  goToMessagePage(index: number) {
    const uid = this.listApplicant[index].uid
    let win = window.open(
      `https://www.facebook.com/Ph%E1%BA%A1m-Trung-Hi%E1%BA%BFu-243428726363142/inbox/?mailbox_id=243428726363142&selected_item_id=${uid}`,
      '_blank'
    )
    win ? win.focus() : ''
  }

  goToUpdatePage(index: number) {
    const id = this.listApplicant[index]._id
    this.$router.push({ name: 'marketingUpdateApplicant', params: { id } })
  }

  deleteApplicant(index: number) {
    request
      .delete(`marketing/applicant/${this.listApplicant[index]._id}`)
      .then(rs => {
        this.listApplicant.splice(index, 1)
        Notification.success('Đã xóa')
      })
      .catch(err => {
        Notification.error('Lỗi, vui lòng liên hệ Admin')
      })
  }
}
</script>
