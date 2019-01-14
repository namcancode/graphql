<template>
    <div class="row">
        <div class="col-xl-6 offset-xl-3">
            <Card v-loading="loading">
                <div slot="header">
                    <h4 class="card-title">
                        <el-button icon="ti-arrow-left" circle type="info" @click="$router.push({name: 'marketingListApplicant'})" /> Thông tin ứng viên
                    </h4>
                </div>
                <form>
                    <div class="row">
                        <FormElement title="Họ và Tên" size="col-sm-6">
                            <el-input v-model="data.name" />
                        </FormElement>
                        <FormElement class="text-center gender-form" size="col-sm-6">
                            <el-radio v-model="data.gender" label="nam">Nam</el-radio>
                            <el-radio v-model="data.gender" label="nữ">Nữ</el-radio>
                        </FormElement>

                        <FormElement title="Chứng minh nhân dân" type="tel" size="col-sm-6">
                            <el-input v-model="data.identityNumber" />
                        </FormElement>

                        <FormElement title="Số điện thoại" type="tel" size="col-sm-6">
                            <el-input v-model="data.phone" />
                        </FormElement>

                        <FormElement title="Tỉnh" size="col-sm-6">
                            <el-select filterable v-model="data.province" placeholder="Chọn tỉnh">
                                <el-option v-for="province in listProvince" :value="province" :label="province" :key="province"></el-option>
                            </el-select>
                        </FormElement>

                        <FormElement title="Năm sinh" size="col-sm-3">
                            <el-date-picker type="year" placeholder="YYYY" format="yyyy" v-model="data.yearOfBirth"></el-date-picker>
                        </FormElement>

                        <FormElement title="Ngày sinh" size="col-sm-3">
                            <el-date-picker placeholder="DD/MM/YYYY" format="dd/MM/yyyy" v-model="data.birthday"></el-date-picker>
                        </FormElement>

                        <FormElement title="Link FB" size="col-sm-6">
                            <el-input v-model="data.fbLink" />
                        </FormElement>

                        <FormElement title="Nguồn KOL" size="col-sm-6">
                            <el-input v-model="data.page" placeholder="Ex: Trung hiếu" />
                        </FormElement>

                        <FormElement title="Đánh dấu source_id" size="col-sm-6">
                            <el-select allow-create v-model="data.source" placeholder="Chọn source_id">
                                <el-option v-for="source in listSource" :value="source" :label="source" :key="source"></el-option>
                            </el-select>
                        </FormElement>

                        <FormElement title="Đối tác" size="col-sm-6">
                            <el-select allow-create v-model="data.company" placeholder="Chọn công ty" clearable>
                                <el-option v-for="company in listCompany" :value="company" :label="company" :key="company"></el-option>
                            </el-select>
                        </FormElement>

                        <FormElement title="Note" size="col-12">
                            <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="Ghi chú lại cho đối tác" v-model="data.note" />
                        </FormElement>
                    </div>
                    <hr />
                    <h4 class="card-title">
                        <i class="ti-tag"></i>
                        {{'Gắn tag ứng viên'}}
                    </h4>
                    <br />
                    <div class="row">
                        <FormElement title="Tên Tag" size="col-sm-5">
                            <el-select allow-create filterable default-first-option v-model="newTag.name">
                                <el-option v-for="tag in listTag" :value="tag" :label="tag" :key="tag"></el-option>
                            </el-select>
                        </FormElement>

                        <FormElement title="Nội dung Tag" size="col-sm-5">
                            <el-input v-model="newTag.value" />
                        </FormElement>

                        <div class="col-sm-2 flex">
                            <el-button icon="ti-plus" circle class="ma mb0" type="success" @click="addTag" />
                        </div>
                    </div>
                    <hr>
                    <div class="row mt20" v-for="(tagName, index) in listTagName" :key="index">
                        <div class="col-sm-5">
                            <el-select allow-create filterable default-first-option v-model="listTagName[index]">
                                <el-option v-for="tag in listTag" :value="tag" :label="tag" :key="tag"></el-option>
                            </el-select>
                        </div>
                        <div class="col-sm-5">
                            <el-input v-model="listTagValue[index]"></el-input>
                        </div>
                        <div class="col-sm-2 flex">
                            <el-button icon="ti-minus" type="danger" class="ma" circle @click="removeTag(index)" />
                        </div>
                    </div>
                    <el-button class="submit-btn" @click="createApplicant" v-if="!applicantId">{{'Thêm ứng viên'}}</el-button>
                    <el-button class="submit-btn" @click="updateApplicant" v-else>{{'Cập nhật ứng viên'}}</el-button>
                </form>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index.ts'
import { Checkbox, Select, Option, DatePicker, Radio, Input, Notification, Button } from 'element-ui'
import request from '@/plugins/request'
import { zipObject, keys, values } from 'lodash'
import MainVue from '@/components/Main.vue'
import { LIST_PROVINCE } from '@/interface/Applicant'
import { COMPANY } from '@/interface/Company'

@Component({
  components: {
    Card,
    FormElement,
    [Checkbox.name]: Checkbox,
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Radio.name]: Radio,
    [Input.name]: Input,
    [Button.name]: Button
  }
})
export default class MarketingCreateApplicant extends MainVue {
  data = {
    tags: {}
  }
  loading = false

  applicantId = ''

  listTagName: string[] = []
  listTagValue: string[] = []

  newTag = {
    name: '',
    value: ''
  }

  listCompany = values(COMPANY)
  listProvince = LIST_PROVINCE

  listSource = ['']

  listTag = ['']

  createApplicant() {
    this.data.tags = zipObject(this.listTagName, this.listTagValue)
    
    request.post('marketing/applicant', this.data).then(rs => {
      Notification.success('Đã thêm ứng viên')
      this.$router.push(`/marketing/applicant/${rs.data._id}`)
    })
  }

  updateApplicant() {
    this.data.tags = zipObject(this.listTagName, this.listTagValue)
    request.put(`marketing/applicant/${this.applicantId}`, this.data).then(rs => {
      Notification.success('Đã cập nhật thông tin ứng viên')
    })
  }

  created() {
    request.get('marketing/list-source').then(rs => {
      this.listSource = rs.data
    })

    this.applicantId = this.$route.params.id
    if (this.applicantId) {
      request.get(`marketing/applicant/${this.applicantId}`).then(rs => {
        this.data = rs.data
        this.listTagName = keys(rs.data.tags)
        this.listTagValue = values(rs.data.tags)
      })
    }
  }

  addTag() {
    if (!this.newTag.name) {
      Notification.error('Không được thêm tag trống')
      return
    }
    if (this.listTagName.indexOf(this.newTag.name) > -1) {
      Notification.error('Tag đã tồn tại')
      return
    }
    this.listTagName.push(this.newTag.name)
    this.listTagValue.push(this.newTag.value)
    this.newTag = { name: '', value: '' }
  }

  removeTag(index: number) {
    this.listTagName.splice(index, 1)
    this.listTagValue.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
.submit-btn {
  margin-top: 30px;
}
.gender-form {
  margin-top: 40px;
  label {
    display: inline;
  }
}
</style>
