<template>
  <div>
    <div class="row">
      <div class="q-pa-md full-width text-white">
        <q-list dark bordered separator class="bg-primary">
          <q-item>
            <q-item-section avatar class="white text-subtitle2 ase-roboto">#</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Name</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Email</q-item-section>
          </q-item>
          <q-item
            clickable
            v-ripple
            v-for="(info, index) of getPartnersUsersList"
            :key="'companyUSERR' + info.name + '' + index + info.email"
          >
            <q-item-section avatar class="white text-subtitle2 ase-roboto">{{ index + 1 }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.name }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.email }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="getPartnersUsersList.length === 0">
          <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No Data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { useUsersStore } from 'stores'
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.fetchPartnerList({
    pagination: {
      partner_id: urlSafeBase64Decode(route.params.partnerId)
    },
    reset: true
  })
})

const getPartnersUsersList = computed(() => usersStore.partnersList)
</script>
