<template>
    <ul class="navbar-nav" style="margin-left:40px;">
         <li class="nav-item">
            <router-link class="nav-link" :to="{name:'javietAdminReport'}">
                <i class="ti-stats-up"></i> {{$t('Báo cáo')}}
            </router-link>
        </li>

        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'javietAdmin'}">
                <i class="ti-user"></i> {{$t('Ứng viên')}}
            </router-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class JavietAdminMenu extends Vue {}
</script>
