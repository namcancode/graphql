<template>
    <ul class="navbar-nav" style="margin-left:40px;">
        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'javietRecuiterReport'}">
                <i class="ti-stats-up"></i> {{$t('Báo cáo')}}
            </router-link>
        </li>
        
        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'javiet'}">
                <i class="el-icon-phone-outline"></i> {{$t('Tư vấn')}}
            </router-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class JavietMenu extends Vue {}
</script>
