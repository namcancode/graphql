<template>
  <nav class="navbar navbar-expand-lg bg-ihr" :class="{'nav-open': isShowMobileMenu}">
    <div class="container">
      <div class="navbar-translate">
        <router-link class="navbar-brand" to="/">
          <img src="@/assets/img/logo-invert.png">
        </router-link>

        <button class="navbar-toggler navbar-toggler-right" :class="{toggled: isShowMobileMenu}" @click="toggleMobileMenu" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse" id="navbarSupportedContent" @blur="toggleMobileMenu">

        <Admin-Menu v-if="user.role === ROLE.ADMIN" />
        <Marketer-Menu v-if="user.role === ROLE.MARKETER" />
        <Tinhloi-Menu v-if="user.role === ROLE.TINHLOI_RECRUITER" />
        <Javiet-Menu v-if="user.role === ROLE.JAVIET_RECRUITER" />
        <Javiet-Admin-Menu v-if="user.role === ROLE.JAVIET_ADMIN" />

        <ul class="navbar-nav ml-auto user-info">
          <drop-down class="nav-item" title-classes="nav-link caret-hidden">
            <div slot="title" class="card-user">
              <img class="avatar" src="@/assets/img/default-avatar.jpg">
            </div>
            <router-link class="dropdown-item" :to="{name: 'me'}">{{$t('Thông tin cá nhân')}}</router-link>
            <a class="dropdown-item" href="#">{{$t('Thông báo')}}</a>
            <a class="dropdown-item" @click.prevent="logout">{{$t('Đăng xuất')}}</a>
          </drop-down>

          <drop-down class="nav-item lang" title-classes="nav-link caret-hidden">
            <div slot="title" class="lang-title">
              <img :src="getLangFlagUrl(i18n.locale)">
            </div>
            <div class="lang-content">
              <img @click="changeLang(lang)" :src="getLangFlagUrl(lang)" v-for="lang in listLang" :key="lang">
            </div>
          </drop-down>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script lang="ts">
import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import Component from 'vue-class-component'
import { mapMutations, mapActions, mapState } from 'vuex'
import i18n, { listLang } from '@/plugins/i18n'
import { DropDown, MarketerMenu, AdminMenu, TinhloiMenu, JavietMenu, JavietAdminMenu } from '@/components/index'
import { ROLE } from '@/interface/User'
import MainVue from '@/components/Main.vue'

@Component({
  components: { DropDown, MarketerMenu, AdminMenu, TinhloiMenu, JavietMenu, JavietAdminMenu },
  methods: {
    ...mapActions(['logout', 'changeLang'])
  },
  computed: {
    ...mapState(['user'])
  }
})
export default class TopNavbar extends MainVue {
  listLang = listLang
  i18n = i18n
  ROLE = ROLE

  isShowMobileMenu = false

  getLangFlagUrl(lang: string) {
    return '/img/lang/' + lang + '.png'
  }

  changeLang(lang: string) {
    this.i18n.locale = lang
  }

  toggleMobileMenu() {
    this.isShowMobileMenu = !this.isShowMobileMenu
  }
}
</script>
<style lang="scss">
.card-user {
  .avatar {
    width: 50px !important;
    height: 50px !important;
    border: 2px solid #ffffff !important;
    margin-bottom: 0 !important;
  }
}
.nav-item {
  display: flex;
  > * {
    margin: auto !important;
  }
}

.navbar-brand {
  img {
    width: 100px;
  }
}

.lang {
  .dropdown-menu {
    min-width: inherit;
  }
  .lang-title {
    background: #ffffff;
    padding: 0 4px;
    img {
      width: 35px;
    }
  }
  .lang-content {
    padding: 10px;
    display: flex;
    > * + * {
      margin-left: 15px;
    }
  }
}

.bg-ihr {
  background: #224d8c !important;
}

@media (max-width: 576px) {
  .navbar-brand {
    margin-left: 20px !important;
  }
  .navbar-toggler {
    margin-right: 10px !important;
  }
}

@media screen and (max-width: 991px) {
  .navbar .navbar-collapse.collapse {
    position: fixed;
    display: block !important;
    top: 0;
    height: 100%;
    width: 230px;
    right: 0;
    z-index: 1032;
    visibility: visible;
    background-color: #999;
    overflow-y: visible;
    border-top: none;
    text-align: left;
    padding-right: 0;
    padding-left: 40px;
    padding-top: 15px;
    transform: translateX(230px);
    transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);
  }
  .navbar.nav-open .navbar-collapse.collapse {
    transform: translateX(0);
  }
  .navbar.navbar.nav-open {
    .navbar-translate {
      transform: translateX(-230px);
    }
  }

  .navbar-toggler {
    padding: 0.25rem 0.75rem;
    font-size: 1.25rem;
    line-height: 1;
    background-color: transparent;
    border: 1px solid transparent;
    border-radius: 0.25rem;
  }

  .navbar-translate {
    width: 100%;
    position: relative;
    display: flex;
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
    -ms-flex-align: center;
    align-items: center;
    transform: translateX(0);
    transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);
  }

  #navbarSupportedContent {
    background: #224d8c;
  }
  .navbar-collapse .navbar-nav > .nav-item > .nav-link {
    margin: 0;
    color: #fff !important;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    line-height: 1.5em;
    padding: 15px 0;
  }

  .nav-item > a {
    font-size: 12px !important;
  }

  .user-info {
    border-top: 1px solid #fff;
    margin-top: 30px;
  }
}
</style>

