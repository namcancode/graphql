<template>
  <div class="row">
    <div class="col-xl-6 offset-xl-3">
      <Card title="Thông tin ứng viên" v-loading="loading.info">
        <div slot="header">
          <h4 class="card-title">
            <el-button icon="ti-arrow-left" circle type="info" @click="$router.back()"/>Thông tin ứng viên
          </h4>
        </div>
        <div class="row">
          <Form-Element title="Họ và tên" size="col-4">{{applicant.name}}</Form-Element>
          <Form-Element title="Số điện thoại" size="col-4">{{applicant.phone}}</Form-Element>
          <Form-Element title="Ngày import" size="col-4">{{applicant.createdAt | date('HH:mm dd/MM')}}</Form-Element>
          <Form-Element title="Tỉnh" size="col-4">{{applicant.province}}</Form-Element>
          <Form-Element title="Ngày sinh" size="col-4">
            <span v-if="applicant.birthday">{{applicant.birthday | date('dd/MM/YYYY')}}</span>
            <span v-else>{{applicant.yearOfBirth}}</span>
          </Form-Element>
          <Form-Element title="Facebook" size="col-4">
            <a :href="fbLink" target="_blank">Trang cá nhân</a>
          </Form-Element>
          <Form-Element title="Ghi chú" size="col-12" style="white-space: pre-line;">{{applicant.note}}</Form-Element>
        </div>
      </Card>

      <Card :title="'Tư vấn lần ' + (index + 1)" v-for="(engage, index) in listEngage" :key="index" :id="'engage-' + index">
        <div class="row">
          <Form-Element title="Thời gian" size="col-4">{{engage.createdAt | date('HH:mm dd/MM/YYYY')}}</Form-Element>
          <Form-Element title="Cập nhật" size="col-4">{{engage.updatedAt | date('HH:mm dd/MM/YYYY')}}</Form-Element>

          <Form-Element title="Giờ hẹn gọi lại">
            <el-date-picker type="datetime" v-model="engage.callBackTime" style="width: 100%;" format="dd/MM/yyyy HH:mm"></el-date-picker>
          </Form-Element>

          <Form-Element title="Trạng thái cuộc gói">
            <el-select v-model="engage.callStatus">
              <el-option v-for="(value, key) in listCallStatus" :value="value" :label="value" :key="key"></el-option>
            </el-select>
          </Form-Element>

          <Form-Element title="Note">
            <el-input v-model="engage.note" type="textarea" :autosize="{minRows: 3, maxRows: 10}"/>
          </Form-Element>

          <div class="col-12" style="margin-top: 30px">
            <el-button @click="update(index)" type="warning">Cập nhật</el-button>
            <el-button @click="destroy(index)" type="danger">Xóa</el-button>
          </div>
        </div>
      </Card>

      <Card title="Tư vấn mới" v-loading="loading.create">
        <div class="row">
          <Form-Element title="Giờ hẹn gọi lại">
            <el-date-picker type="datetime" v-model="newEngage.callBackTime" style="width: 100%;"></el-date-picker>
          </Form-Element>

          <Form-Element title="Trạng thái cuộc gọi">
            <el-select v-model="newEngage.callStatus">
              <el-option v-for="(value, key) in listCallStatus" :value="value" :label="value" :key="key"></el-option>
            </el-select>
          </Form-Element>
          <Form-Element title="Note">
            <el-input v-model="newEngage.note" type="textarea" :autosize="{minRows: 3, maxRows: 10}"/>
          </Form-Element>

          <div class="col-12" style="margin-top: 30px">
            <el-button type="success" @click="create">Thêm tư vấn</el-button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index'
import { Input, Button, Notification, Loading } from 'element-ui'
import request from '@/plugins/request'
import { IApplicant } from '@/interface/Applicant'
import { IApplicantEngage } from '@/interface/ApplicantEngage'
import { LIST_CALL_STATUS } from '@/interface/TinhLoi'

@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Button.name]: Button
  }
})
export default class JavietDetail extends Vue {
  listEngage = [] as IApplicantEngage[]
  newEngage = {} as IApplicantEngage | {}
  applicant = {} as IApplicant

  listCallStatus = LIST_CALL_STATUS

  loading: { info: boolean; create: boolean } = { info: false, create: false }

  created() {
    this.loading.info = true
    request
      .get(this.apiUrl)
      .then(rs => {
        this.listEngage = rs.data.listEngage
        this.applicant = rs.data.applicant
      })
      .finally(() => (this.loading.info = false))
  }

  get fbLink() {
    return `https://facebook.com/${this.applicant.uid}`
  }

  get apiUrl() {
    return `tinhloi/${this.$route.params.historyId}`
  }

  create() {
    this.loading.create = true
    request
      .post(this.apiUrl, { applicant: this.applicant, engage: this.newEngage })
      .then(rs => {
        Notification.success('Thêm lịch sử tư vấn thành công')
        this.listEngage.push(rs.data)
        this.newEngage = {}
      })
      .finally(() => (this.loading.create = false))
  }

  update(index: number) {
    const engage = this.listEngage[index]
    const loading = Loading.service({ target: '#engage-' + index })
    request
      .put(`${this.apiUrl}/${engage._id}`, { applicant: this.applicant, engage: engage })
      .then(rs => {
        Notification.success('Sửa lịch sử tư vấn thành công')
      })
      .finally(() => loading.close())
  }

  destroy(index: number) {
    const engage = this.listEngage[index]
    const loading = Loading.service({ target: '#engage-' + index })
    request
      .delete(`${this.apiUrl}/${engage._id}`)
      .then(rs => {
        Notification.success('Đã xóa lịch sử tư vấn')
        this.listEngage.splice(index, 1)
      })
      .finally(() => loading.close())
  }
}
</script>

