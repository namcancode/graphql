<template>
  <div class="wrapper">
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content>

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<script>
import TopNavbar from '@/components/Layout/TopNavbar.vue'
import ContentFooter from '@/components/Layout//ContentFooter.vue'
import DashboardContent from '@/components/Layout//Content.vue'

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent
  },
  methods: {}
}
</script>

<style lang="scss">
.main-panel {
  width: 100% !important;
}
</style>

