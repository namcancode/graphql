<template>
    <ul class="navbar-nav" style="margin-left:40px;">
        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'tinhloi'}">
                <i class="el-icon-date"></i> {{$t('Phỏng vấn')}}
            </router-link>
        </li>
    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class TinhloiMenu extends Vue {}
</script>
