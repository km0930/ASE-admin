<template>
  <q-card style="background-color: #313132; height: 100%; min-height: 100%">
    <q-flashcard :no-hover="hover" class="bg-primary" :style="style">
      <q-list class="cursor_pointer" @click="moveToDetailedInfo(data)">
        <q-item>
          <q-item-section class="text-caption" align="left">Start date</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ dateFormatReadable(data.startDate) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-caption" align="left">End date</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ dateFormatReadable(data.endDate) }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-caption" align="left">Max Users</q-item-section>
          <q-item-section class="text-caption" avatar>
            {{ data.numUsers || 0 }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-flashcard>
    <div class="row text-subtitle2 q-pt-sm padding_12">
      <div class="col-md-12 col-sm-12 col-xs-12" v-if="data.name">
        <p class="text-subtitle2">{{ data.name.length > 30 ? data.name.substring(0, 30) + ' ... ' : data.name }}</p>
        <q-tooltip>{{ data.name }}</q-tooltip>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12" v-else>
        <p class="text-subtitle2 text-red">null</p>
      </div>
      <div class="col-md-10 col-sm-10 col-xs-10">
        <div class="text-caption">
          <q-chip outline size="sm" v-if="data.subscriptionType" color="orange" text-color="white">
            {{ data.subscriptionType }}
          </q-chip>
          <q-chip outline size="sm" :color="!expired ? 'red' : 'green'" text-color="white" v-if="!expired">
            {{ !expired ? 'Expired' : 'Active' }}
          </q-chip>
        </div>
      </div>
      <div class="col-md-2 col-sm-2 col-xs-2">
        <q-btn class="float-right" size="sm" text-color="white" style="display: inline-block" icon="more_vert">
          <q-menu dark>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="emitCopySignUpURL(data)">
                <q-item-section>Copy Signup URL</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="emitUpdatePage(data)">
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
import { dateFormatReadable, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, defineEmits, defineProps, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  data: {},
  expired: {},
  itemType: {}
})
const router = useRouter()
const emit = defineEmits(['copySignUpURL', 'updatePage'])
const hover = ref(false)
const expired = ref(props.expired)
const data = reactive(props.data)
function moveToDetailedInfo(data) {
  router.push(`/portal/partner/${urlSafeBase64Encode(data.id)}/`)
}
const emitCopySignUpURL = (data) => {
  emit('copySignUpURL', data)
}
const emitUpdatePage = (data) => {
  emit('updatePage', data)
}
const style = computed(() => ({
  width: '100%',
  height: '100%',
  padding: '1px',
  border: '1px solid #313132',
  textAlign: 'center',
  boxShadow: '1px 1px 2px #313132'
}))
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
</style>
