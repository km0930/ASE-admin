<template>
  <q-card :class="{ 'shadow-5 active-border': data.managed }" style="background-color: #313132; height: 100%; min-height: 100%">
    <q-flashcard :no-hover="hover" class="bg-primary" :style="style">
      <q-list class="cursor-pointer" @click="moveToDetailedInfo(data)">
        <q-item>
          <q-item-section class="text-caption text-left">Start date</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ dateFormatReadable(data.startDate) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-caption text-left">End date</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ dateFormatReadable(data.endDate) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-caption text-left">Monthly Minutes</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ data.monthlyMinutes }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-caption text-left">Max Users</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ data.numUsers || 0 }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-flashcard>
    <div class="row text-subtitle2 q-pa-sm">
      <div v-if="data.name" class="col-md-12 col-sm-12 col-xs-12 cursor-pointer" @click="moveToDetailedInfo(data)">
        <p>{{ data.name.length > 30 ? data.name.substring(0, 30) + ' ... ' : data.name }}</p>
        <q-tooltip>{{ data.name }}</q-tooltip>
      </div>
      <div v-else class="col-md-12 col-sm-12 col-xs-12" @click="moveToDetailedInfo(data)">
        <p class="text-red">null</p>
      </div>
      <div class="col-md-10 col-sm-10 col-xs-10 cursor-pointer" @click="moveToDetailedInfo(data)">
        <div class="text-caption">
          <q-chip v-if="data.subscriptionType" size="xs" class="text-weight-bold" text-color="dark">
            {{ data.subscriptionType }}
          </q-chip>
          <q-chip v-if="expired" outline size="xs" class="text-weight-bold" :color="expired ? 'red' : 'green'" text-color="dark">
            {{ expired ? 'Expired' : 'Active' }}
          </q-chip>
          <q-chip v-for="item in planData" :key="item" size="xs" class="text-weight-bold">{{ item }}</q-chip>
        </div>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-2">
        <q-btn class="float-right" size="sm" text-color="white" style="display: inline-block" icon="more_vert">
          <q-menu dark>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="$emit('copySignUpURL')">
                <q-item-section>Copy Signup URL</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('updatePage')">
                <q-item-section>Update</q-item-section>
              </q-item>
              <q-separator />
            </q-list>
          </q-menu>
        </q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { dateFormatReadable } from 'src/utils/reuseFunctions'
import { computed, ref } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({ plan: '' })
  },
  expired: {
    type: Object,
    required: false,
    default: () => ({})
  },
  itemType: {
    type: Object,
    required: false,
    default: () => ({})
  }
})
const emit = defineEmits(['viewCompanyInfo'])
const hover = ref(false)

const style = computed(() => {
  return {
    width: '100%',
    padding: '1px',
    border: '1px solid #313132',
    textAlign: 'center',
    boxShadow: '1px 1px 2px #313132'
  }
})
const planData = computed(() => {
  const splitUSD = (props.data.plan ?? '').split('-USD-')
  const beforeEnterprise = splitUSD?.[0].split('-')
  const removeFirstOrder = beforeEnterprise.slice(1).join(' ')
  return [removeFirstOrder, splitUSD?.[1]].filter(Boolean)
})

function moveToDetailedInfo(data) {
  emit('viewCompanyInfo')
}
</script>

<style lang="sass" scoped>
.description
  padding: 10px
  background-color: black
  color: white
  box-shadow: 1px 1px 2px #e6e6e6

.my-header
  width: 100%
  top: 0
  height: 45px
  color: white
  background-color: rgba(0,0,0,0.8)
  text-transform: uppercase
  text-align: center
  font-size: 17px
  margin: 20px 0 0 0
  padding: 10px

.my-text
  width: 100%
  top: 0
  color: black
  height: 100%
  background: #fff
  text-align: center
  font-size: 12px
  margin: 7px
  padding: 10px
  line-height: normal

.my-button-container
  width: 100%

.my-button
  text-decoration: none
  text-transform: uppercase
  margin: 0 0 20px 0
  text-align: center
  background-color: #000
  color: #fff
  text-transform: uppercase
  box-shadow: 0 0 1px #000
  transition-delay: 0.2s

.my-button:hover
  box-shadow: 0 0 5px #000

.q-card
  transition: all .2s

.q-card:hover
  -ms-transform: scale(1.08)
  -webkit-transform: scale(1.08)
  transform: scale(1.08)

.q-card .text-subtitle2
  background-color: rgb(43, 43, 44)

.active-border
  border: 2px solid #ffff
</style>
