<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import request from '@/plugins/request'
import Vue from 'vue'
import { IUserState } from '@/store/user'

@Component({})
export default class MainVue extends Vue {
  get user() {
    return this.$store.state.user as IUserState
  }
}
</script>
