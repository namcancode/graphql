<template>
    <ul class="navbar-nav" style="margin-left:40px;">

        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'marketingListApplicant'}">
                <i class="ti-list-ol"></i> Danh sách ứng viên
            </router-link>
        </li>

        <li class="nav-item">
            <router-link class="nav-link" :to="{name:'marketingCreateApplicant'}">
                <i class="ti-plus"></i> Thêm ứng viên
            </router-link>
        </li>

    </ul>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({})
export default class MarketerMenu extends Vue {}
</script>
