<template>
    <div class="row">
        <div class="col-6 offset-3">
            <Card title="Đổi mật khẩu">
                <form @submit.prevent="submit">
                    <Form-Element title="Mật khẩu cũ">
                        <el-input v-model="data.oldPassword" type="password" />
                    </Form-Element>

                    <Form-Element title="Mật khẩu mới">
                        <el-input v-model="data.newPassword" type="password" />
                    </Form-Element>

                    <Form-Element title="Nhập lại mật khẩu mới">
                        <el-input v-model="data.repeatNewPassword" type="password" />
                    </Form-Element>

                    <div class="col-12" style="margin-top: 25px;">
                        <el-button @click="submit" type="primary">Đổi mật khẩu</el-button>
                    </div>
                </form>
            </Card>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index'
import { Input, Button, Notification } from 'element-ui'
import request from '@/plugins/request'

interface SubmitData {
  newPassword: string
  oldPassword: string
  repeatNewPassword: string
}

@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Button.name]: Button
  }
})
export default class Me extends Vue {
  data = {} as SubmitData

  submit() {
    if (this.data.newPassword !== this.data.repeatNewPassword) {
      Notification.warning('Mật khẩu mới chưa khớp')
      return
    }

    request
      .put('auth', this.data)
      .then(rs => {
        Notification.success('Đổi mật khẩu thành công')
      })
      .catch(err => {
        Notification.error(err.message || 'Có lỗi xảy ra và đã được gửi đến Admin. iHR thành thật xin lỗi!')
      })
  }
}
</script>

