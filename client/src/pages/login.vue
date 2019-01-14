<template>
  <div>
    <div class="wrapper wrapper-full-page">
      <div class="full-page login-page" data-color="blue" data-image="static/img/background/background-2.jpg">
        <!--   you can change the color of the filter page using: data-color="blue | azure | green | orange | red | purple" -->
        <div class="content">
          <div class="container">
            <div class="row">
              <div class="col-md-6 col-lg-5 col-xl-4 mx-auto">
                <Apollo-Mutation :mutation="loginMutation" :variables="{username, password}" @done="onLoginSuccess">
                  <template slot-scope="{loading, mutate}">
                    <form v-loading="loading" @submit.prevent="mutate">
                      <div class="card" data-background="color" data-color="blue">
                        <div class="card-header">
                          <h3 class="card-title">
                            <img src="@/assets/img/logo.png">
                          </h3>
                        </div>
                        <div class="card-content">
                          <div class="form-group">
                            <label>Username</label>
                            <input placeholder="Enter username" class="form-control input-no-border" v-model="username">
                          </div>
                          <div class="form-group">
                            <label>Password</label>
                            <input type="password" placeholder="Password" class="form-control input-no-border" v-model="password">
                          </div>
                        </div>
                        <div class="card-footer text-center">
                          <button type="submit" class="btn btn-fill btn-wd">Đăng nhập</button>
                        </div>
                      </div>
                    </form>
                  </template>
                </Apollo-Mutation>
              </div>
            </div>
          </div>
        </div>

        <div class="full-page-background" style="background-image: url(static/img/background/background-2.jpg) "></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { sample } from 'lodash'
import store from '@/store/index'
import Vue from 'vue'
import { mapActions } from 'vuex'
import { loginMutation } from '@/apollo/auth/AuthMutation'
import router from '@/router'

@Component({
  data() {
    return {
      loginMutation
    }
  }
})
export default class Login extends Vue {
  username = ''
  password = ''

  onLoginSuccess(rs: any) {
    store.commit('LOGIN_SUCCESS', rs.data.login)
    router.push({ name: 'home' })
  }
}
</script>
<style lang="scss">
.card-title {
  img {
    width: 120px;
  }
}
</style>
