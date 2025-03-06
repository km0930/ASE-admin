<template>
  <q-layout view="lHh Lpr lff">
    <q-header elevated class="bg-primary">
      <q-toolbar>
        <BreadCrumb />
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round flat>
            <q-menu dark transition-show="jump-down" transition-hide="jump-up">
              <q-list style="min-width: 100px">
                <q-item active-class="text-orange" clickable to="/portal/userprofile">
                  <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable @click="logout">
                  <q-item-section>Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
            <q-avatar size="26px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
            </q-avatar>
          </q-btn>
        </div>
      </q-toolbar>
      <div class="q-mini-drawer-hide absolute" :style="{ top: '5px', left: `${leftDrawerOpen ? -17 : -17}px` }">
        <q-btn
          class="bg-white text-black"
          dense
          :icon="leftDrawerOpen ? 'chevron_left' : 'chevron_right'"
          round
          unelevated
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </div>
    </q-header>

    <q-drawer show-if-above :mini="!leftDrawerOpen" :width="240" :breakpoint="500" class="bg-primary">
      <template v-slot:mini>
        <q-scroll-area class="fit mini-slot bg_dark">
          <div class="column items-center none-spacing">
            <div class="bg-transparent">
              <q-avatar size="56px" class="q-mb-sm" />
            </div>
            <div v-for="(route, index) in routes" :key="index + route.title">
              <div class="cursor_pointer" @click="router.push(route.link)">
                <q-avatar :class="{ 'bg-orange border-radius': router.currentRoute.value.path === route.link }">
                  <q-icon :name="route.icon" color="white" size="sm" />
                  <q-tooltip anchor="center right" self="center left">
                    {{ route.title }}
                  </q-tooltip>
                </q-avatar>
              </div>
            </div>
          </div>
        </q-scroll-area>
      </template>
      <q-scroll-area class="fit">
        <div class="q-pa-lg">
          <q-img src="logo.svg" width="10rem" />
        </div>
        <q-list>
          <q-item v-for="(route, index) in routes" clickable :key="index" :to="route.link" v-bind="route" v-ripple>
            <q-item-section class="q-pa-sm" :class="{ 'text-orange ': router.currentRoute.value.path === route.link }" side v-ripple>
              <q-icon :class="{ 'text-orange': router.currentRoute.value.path === route.link }" color="white" :name="route.icon" />
            </q-item-section>
            <q-item-section
              class="q-pl-sm text-bold text-subtitle2 text-white"
              :class="{ 'text-orange': router.currentRoute.value.path === route.link }"
            >
              {{ route.title }}
            </q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container class="bg-dark" style="color: #ffffff">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import BreadCrumb from 'components/breadcrumb'
import { LocalStorage } from 'quasar'
import { useLoginStore, useTagsStore } from 'src/stores'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const tagsStore = useTagsStore()
const loginStore = useLoginStore()
const router = useRouter()
const leftDrawerOpen = ref(true)
const routes = ref([
  { title: 'Dashboard', icon: 'home', link: '/portal/dashboard' },
  { title: 'Instructor', icon: 'face', link: '/portal/instructor' },
  { title: 'Learning Path', icon: 'add_road', link: '/portal/learning-path' },
  { title: 'Delivery', icon: 'badge', link: '/portal/delivery' },
  { title: 'Labs', icon: 'science', link: '/portal/labs' },
  { title: 'Courses', icon: 'school', link: '/portal/courses' },
  { title: 'Course Map & Bundles', icon: 'map', link: '/portal/map' },
  { title: 'Certification', icon: 'workspace_premium', link: '/portal/certification' },
  { title: 'Challenge', icon: 'fas fa-chess-board', link: '/portal/challenges' },
  { title: 'AI Challenge', icon: 'img:sidebar_aiquiz.svg', link: '/portal/ai_challenges' },
  { title: 'Corporate', icon: 'list', link: '/portal/company' },
  { title: 'Partner', icon: 'link', link: '/portal/partner' },
  { title: 'Events', icon: 'class', link: '/portal/events' },
  { title: 'Admin users', icon: 'settings', link: '/portal/settings' },
  { title: 'Unpublished Courses', icon: 'school', link: '/portal/un-published-courses' },
  { title: 'Tags', icon: 'style', link: '/portal/tags' },
  { title: 'Journeys', icon: 'explore', link: '/portal/journeys' }

  // TODO: Uncomment for BlackHat event
  // { title: 'Offline payments', icon: 'cloud_off', link: '/portal/offline-payments' }
])

onMounted(() => {
  // store.dispatch('tags/getTagList')
  tagsStore.getTagList({ tag_name: '' })
  const role = LocalStorage.getItem('user').role
  if (role === 'Creator') {
    const unauthorizedPages = ['Corporate', 'Dashboard', 'Partner', 'Admin users']
    routes.value = routes.value.filter((route) => !unauthorizedPages.includes(route.title))
  }
})

function logout() {
  loginStore.logout()
}
</script>

<style scoped>
.border-radius {
  border-radius: 5px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
