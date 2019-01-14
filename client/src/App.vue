<template>
  <div v-loading.fullscreen.lock="!ready">
    <router-view v-if="ready" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapState } from 'vuex'

@Component({
  computed: {
    ...mapState(['ready'])
  }
})
export default class App extends Vue {}
</script>
