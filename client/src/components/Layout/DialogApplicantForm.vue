<template>
  <el-dialog title="Thông tin ứng viên" :visible.sync="dialogVisible.visible" width="50%" center append-to-body>
    <el-row :gutter="40">
      <el-form :model="dialogVisible.applicant" ref="dialogVisible.applicant" label-position="top" show-message validate-on-rule-change>
        <el-col :span="12" prop="name">
          <el-form-item label="Tên ứng viên" :rules="{ required: true, trigger: 'blur', message:'cần có tên'}" show-message validate-on-rule-change>
            <el-input v-model="dialogVisible.applicant.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Giới tính" prop="gender">
            <el-select v-model="dialogVisible.applicant.gender">
              <el-option value="nam">Nam</el-option>
              <el-option value="nữ">Nữ</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Ngày sinh" prop="birthday">
            <el-date-picker v-model="dialogVisible.applicant.birthday" format="dd/MM/yyyy"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Số điện thoại" prop="phone">
            <el-input v-model="dialogVisible.applicant.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CMND" prop="identityNumber">
            <el-input v-model="dialogVisible.applicant.identityNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Tỉnh" prop="province">
            <el-select v-model="dialogVisible.applicant.province" filterable>
              <el-option v-for="(province, key) in listProvince" :value="province" :key="key">{{province}}</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" prop="uid">
          <el-form-item label="Facebook" v-if="dialogVisible.titleButton === 'Thêm ứng viên'">
            <el-input v-model="dialogVisible.applicant.uid" placeholder="Link facebook của ứng viên">
              <template slot="prepend">Https://</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Nguồn" prop="source" v-if="dialogVisible.titleButton === 'Cập nhật'">
            <el-select v-model="dialogVisible.applicant.source" filterable>
              <el-option value="masoffer_event">masoffer_event</el-option>
              <el-option value="ib_event">ib_event</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Note" prop="note">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Note của ứng viên" v-model="dialogVisible.applicant.note"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button @click="hideDialog">Hủy</el-button>
            <el-button type="primary" @click="dialogVisible.titleButton === 'Cập nhật' ? updateApplicant(dialogVisible.applicant) : createApplicant(dialogVisible.applicant)">{{dialogVisible.titleButton}}</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </el-dialog>
</template>

<script lang="ts">
import request from '@/plugins/request'
import { IApplicant, IApplicantHistory, LIST_PROVINCE } from '@/interface/Applicant'
import { Notification, Loading } from 'element-ui'
import Vue from 'vue'
import Component from 'vue-class-component'

const AppProps = Vue.extend({
  props: {
    dialogVisible: {
      type: Object,
      default: ''
    }
  }
})

@Component({})
export default class DialogApplicantForm extends AppProps {
  listProvince = LIST_PROVINCE

  hideDialog() {
    this.dialogVisible.visible = false
  }

  updateApplicant() {
    const applicant = this.dialogVisible.applicant

    request.put(`tinhloi/applicant`, applicant).then(rs => {
      Notification.success('Đã cập nhật thông tin ứng viên')
      this.hideDialog()
    })
  }

  createApplicant(applicantForm: any) {
    const applicant = this.dialogVisible.applicant

    if (!applicant.name) {
      return Notification.info('Điền Tên của ứng viên')
    }

    request.post(`tinhloi/applicant`, applicant).then(rs => {
      Notification.success('Đã tạo thông tin ứng viên')
      this.$emit('newApplicant', applicant)
      this.hideDialog()
    })
  }
}
</script>
