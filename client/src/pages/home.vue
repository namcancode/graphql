<template>

</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import MainVue from '@/components/Main.vue'
import { ROLE } from '@/interface/User'
import { COMPANY } from '@/interface/Company'

@Component({})
export default class Home extends MainVue {
  created() {
    let routeName = 'login'

    if (this.user.role === ROLE.JAVIET_ADMIN) {
      routeName = 'javietAdmin'
    }

    if (this.user.role === ROLE.JAVIET_RECRUITER) {
      routeName = 'javiet'
    }

    if (this.user.role === ROLE.TINHLOI_RECRUITER) {
      routeName = 'tinhloi'
    }

    if (this.user.role === ROLE.ADMIN) {
      routeName = 'listUser'
    }

    if (this.user.role === ROLE.MARKETER) {
      routeName = 'marketingReport'
    }

    this.$router.replace({ name: routeName })
  }
}
</script>
