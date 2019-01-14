<template>
    <ul class="navbar-nav" style="margin-left:40px;">
        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'listUser'}">
                <i class="ti-users"></i> {{$t('Quản lý user')}}
            </router-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { DropDown } from '@/components/index'

@Component({
  components: {
    DropDown
  }
})
export default class AdminMenu extends Vue {}
</script>
