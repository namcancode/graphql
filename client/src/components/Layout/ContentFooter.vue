<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <nav>
        <ul>
          <li>
            <router-link :to="{name: 'home'}">Trang chủ</router-link>
          </li>
        </ul>
      </nav>
      <div class="copyright d-flex flex-wrap">
        &copy; Made with
        <i class="ti-heart heart"></i> by
        <a href="//ihrsolution.vn" target="_blank"> &nbsp; iHR Solution.</a>&nbsp;
      </div>
    </div>
  </footer>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.heart {
  margin: 0 7px;
}
</style>
