<template>
  <div>
    <card title="Filter">
      <div class="row">
        <FormElement size="col-md-4" title="Tìm kiếm">
          <el-input v-model="filter.search"/>
        </FormElement>

        <FormElement size="col-md-4" title="Vai trò">
          <el-select v-model="filter.role" multiple>
            <el-option v-for="role in listRole" :label="role" :value="role" :key="role"></el-option>
          </el-select>
        </FormElement>

        <FormElement size="col-md-4" title="Công ty">
          <el-select v-model="filter.company" multiple>
            <el-option v-for="company in listCompany" :label="company" :value="company" :key="company"></el-option>
          </el-select>
        </FormElement>

        <div class="col-md-12" style="margin-top:42px">
          <el-button @click="$apollo.queries.users.refetch()" type="info" icon="ti-search">Lọc User</el-button>
          <el-button @click="$router.push({name: 'createUser'})" type="default" icon="el-icon-plus">Thêm User</el-button>
        </div>
      </div>
    </card>
    <card v-loading="loading">
      <el-table :data="users" style="width: 100%">
        <el-table-column type="index" min-width="50"/>
        <el-table-column prop="username" label="Username" min-width="150"/>
        <el-table-column prop="role" label="Role" min-width="150"/>
        <el-table-column prop="company" label="Company" min-width="150"/>
        <el-table-column prop="lang" label="Language" min-width="150"/>
        <el-table-column label="Công cụ" min-width="200">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" circle type="info" size="small" @click="$router.push({name: 'updateUser', params: {id: scope.row.id}})"/>
            <el-button icon="el-icon-delete" circle type="danger" size="small" @click="deleteUser(scope.$index)"/>
            <el-tooltip class="item" effect="dark" content="Xem CRM như thành viên này" placement="top">
              <el-button icon="ti-arrow-right" circle type="success" size="small" @click="loginAsUser(scope.$index)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Card, FormElement } from '@/components/index'
import { Input, Select, Option, Button, Table, TableColumn, MessageBox, Notification, Tooltip } from 'element-ui'
import request from '@/plugins/request'
import { COMPANY } from '@/interface/Company'
import { ROLE, IUser } from '@/interface/User'
import { values } from 'lodash'
import gql from 'graphql-tag'
import { loginAs, userDelete } from '@/apollo/user/UserMutation'
import { listUser } from '@/apollo/user/UserQuery'
import { apolloClient } from '@/plugins/apollo'

@Component({
  components: {
    Card,
    FormElement,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Tooltip.name]: Tooltip
  },
  apollo: {
    users() {
      return {
        query: listUser,
        variables: {
          filter: this.filter
        }
      }
    }
  }
})
export default class AdminUser extends Vue {
  filter = {
    search: '',
    role: [],
    company: []
  }
  users: IUser[] = []
  listCompany = values(COMPANY)
  listRole = values(ROLE)

  created() {
    this.$apollo.queries.users.refetch()
  }

  get loading():boolean {
    return this.$apollo.queries.users.loading
  }

  async deleteUser(index: number) {
    await MessageBox.confirm('Thao tác xóa thành viên sẽ không thể khôi phục, bạn chắc chứ?', {
      confirmButtonText: 'Chắc chắn xóa',
      cancelButtonText: 'Quay lại',
      type: 'warning'
    })

    await apolloClient.mutate({
      mutation: userDelete,
      variables: {
        userId: this.users[index].id
      }
    })

    this.users.splice(index, 1)
    Notification.success('Đã xóa thành viên')
  }

  async loginAsUser(index: number) {
    this.$store.commit('APP_READY', false)
    this.$apollo
      .mutate({
        mutation: loginAs,
        variables: {
          userId: this.users[index].id
        }
      })
      .then(rs => {
        this.$store.commit('LOGIN_SUCCESS', rs.data.loginAs)
        this.$router.push({ name: 'home' })
      })
      .finally(() => this.$store.commit('APP_READY'))
  }
}
</script>

<style lang="scss" scope="">
label {
  display: block;
}
</style>
