<template>
    <div class="row">
        <div class="col-xl-6 offset-xl-3">

            <Card title="Thông tin ứng viên" v-loading="loading.info">
                <div slot="header">
                    <h4 class="card-title">
                        <el-button icon="ti-arrow-left" circle type="info" @click="$router.back()" /> Thông tin ứng viên
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
                    <Form-Element title="Facebook" size="col-4"> <a :href="fbLink" target="_blank">Trang cá nhân</a></Form-Element>
                    <Form-Element title="Ghi chú" size="col-12" style="white-space: pre-line;">{{applicant.note}}</Form-Element>
                </div>
            </Card>

            <Card :title="'Tư vấn lần ' + (index + 1)" v-for="(engage, index) in listEngage" :key="index" :id="'engage-' + index">
                <div class="row">
                    <Form-Element title="Thời gian" size="col-4">{{engage.createdAt | date('HH:mm dd/MM/YYYY')}}</Form-Element>
                    <Form-Element title="Cập nhật" size="col-4">{{engage.updatedAt | date('HH:mm dd/MM/YYYY')}}</Form-Element>

                    <Form-Element title="Hình thức tư vấn">
                        <el-input v-model="engage.method" />
                    </Form-Element>

                    <Form-Element title="Kết quả tư vấn">
                        <el-input v-model="engage.content" type="textarea" :autosize="{minRows: 3, maxRows: 10}" />
                    </Form-Element>

                    <Form-Element title="Note cho iHR">
                        <el-input v-model="engage.note" type="textarea" :autosize="{minRows: 3, maxRows: 10}" />
                    </Form-Element>

                    <div class="col-12" style="margin-top: 30px">
                        <el-button @click="update(index)" type="warning">Cập nhật</el-button>
                        <el-button @click="destroy(index)" type="danger">Xóa</el-button>
                    </div>
                </div>
            </Card>

            <Card title="Tư vấn mới" v-loading="loading.create">
                <div class="row">
                    <Form-Element title="Hình thức tư vấn">
                        <el-input v-model="newEngage.method" />
                    </Form-Element>

                    <Form-Element title="Kết quả tư vấn">
                        <el-input v-model="newEngage.content" type="textarea" :autosize="{minRows: 3, maxRows: 10}" />
                    </Form-Element>

                    <Form-Element title="Note lại cho iHR">
                        <el-input v-model="newEngage.note" type="textarea" :autosize="{minRows: 3, maxRows: 10}" />
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
    return `javiet/${this.$route.params.historyId}`
  }

  create() {
    this.loading.create = true
    request
      .post(this.apiUrl, { ...this.applicant, ...this.newEngage })
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
      .put(`${this.apiUrl}/${engage._id}`, { ...this.applicant, ...engage })
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

