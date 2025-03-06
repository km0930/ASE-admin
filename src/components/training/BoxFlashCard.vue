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
    <div class="row items-center q-pt-sm padding_12">
      <div class="col-10 text-caption">
        <p v-if="data.name" class="q-mb-none q-ml-xs text-subtitle2">
          {{ data.name.length > 30 ? data.name.substring(0, 30) + ' ... ' : data.name }}
          <q-tooltip v-if="data.name.length > 30">{{ data.name }}</q-tooltip>
        </p>
        <p v-else class="text-subtitle2 text-red">null</p>
        <q-chip v-if="data.subscriptionType" color="orange" outline size="sm" text-color="white">{{ data.subscriptionType }}</q-chip>
        <q-chip :color="!expired ? 'red' : 'green'" outline size="sm" text-color="white">{{ !expired ? 'Expired' : 'Active' }}</q-chip>
      </div>
      <div class="col-2">
        <q-btn class="float-right" icon="more_vert" size="sm" text-color="white">
          <q-menu dark>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="emit('copySignUpURL', data)">
                <q-item-section>Copy Signup URL</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="emit('updatePage', data)">
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
const emit = defineEmits(['copySignUpURL', 'updatePage'])

const router = useRouter()

const style = computed(() => ({
  width: '100%',
  height: '100%',
  padding: '1px',
  border: '1px solid #313132',
  textAlign: 'center',
  boxShadow: '1px 1px 2px #313132'
}))

const hover = ref(false)
const expired = ref(props.expired)
const data = reactive(props.data)
function moveToDetailedInfo(data) {
  router.push(`/portal/events/${urlSafeBase64Encode(data.id)}/`)
}
</script>
