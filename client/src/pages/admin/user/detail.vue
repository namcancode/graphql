<template>
  <div>
    <div class="row">
      <div class="col-6 offset-3">
        <card title="Chi tiết thành viên" v-loading="loading">
          <h4 class="card-title" slot="header">
            <el-button icon="ti-arrow-left" circle type="info" @click="$router.push({name: 'listUser'})"/>Thông tin thành viên
          </h4>
          <div class="row">
            <form-element title="Username" size="col-12">
              <el-input v-model="data.username"/>
            </form-element>

            <form-element title="Mật khẩu" size="col-12">
              <el-input v-model="data.password" type="password"/>
            </form-element>

            <form-element title="Vai trò" size="col-12">
              <el-select v-model="data.role">
                <el-option v-for="role in listRole" :key="role" :label="role" :value="role"/>
              </el-select>
            </form-element>

            <form-element title="Ngôn ngữ" size="col-12">
              <el-select v-model="data.lang">
                <el-option label="vi" value="vi"/>
                <el-option label="en" value="en"/>
              </el-select>
            </form-element>

            <form-element size="col-12">
              <el-button type="success" v-if="userId" @click="updateUser">Cập nhật user</el-button>
              <el-button type="success" v-else @click="createUser">Tạo user</el-button>
            </form-element>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card } from '@/components/index'
import { Input, Select, Option, Button, Table, TableColumn, Notification } from 'element-ui'
import request from '@/plugins/request'
import FormElement from '@/components/Inputs/FormElement.vue'
import { values, pick } from 'lodash'
import { ROLE } from '@/interface/User'
import { COMPANY } from '@/interface/Company'
import { userCreate, userUpdate } from '@/apollo/user/UserMutation'
import { apolloClient, apolloProvider } from '@/plugins/apollo'
import { getUser } from '@/apollo/user/UserQuery'

const initData = {
  username: '',
  password: '',
  role: '',
  lang: 'vi'
}
@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  }
})
export default class AdminUser extends Vue {
  data = { ...initData }
  listRole = values(ROLE)
  userId = ''

  get loading() {
    return this.$apollo.loading
  }

  created() {
    this.userId = this.$route.params.id
    if (this.userId) {
      this.getUser()
    }
  }

  async createUser() {
    await apolloClient.mutate({
      mutation: userCreate,
      variables: { data: this.data }
    })
    this.data = { ...initData }
    Notification.success('Tạo thành viên thành công.')
  }

  async updateUser() {
    await apolloClient.mutate({
      mutation: userUpdate,
      variables: { userId: this.userId, data: pick(this.data, ['username', 'lang', 'role', 'password']) }
    })
    Notification.success('Thay đổi thông tin thành công.')
  }

  async getUser() {
    await apolloClient
      .query({
        query: getUser,
        variables: {
          id: this.userId
        }
      })
      .then((rs: any) => {
        this.data = rs.data.user
      })
  }
}
</script>

<style lang="scss" scoped>
label {
  display: block;
}
</style>
