<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 750px; max-width: 90vw" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update Partner' : 'Create Partner' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy ref="formRef" @submit="onSubmit">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus label="Name *" required v-model="partner.partner_name" />
                <p v-if="fetchErrorMsgs.partner_name" class="text-caption text-negative">{{ fetchErrorMsgs.partner_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect label="Plan Type *" multiple :options="plansOptionsGetter" :rules="required" v-model="partner.plans" />
                <p v-if="fetchErrorMsgs.plans" class="text-caption text-negative">{{ fetchErrorMsgs.plans_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput
                  clearable
                  :disable="Boolean(props.id)"
                  label="Start Date *"
                  :options="(date) => date >= todayDate() && (partner.end_date ? date < partner.end_date : true)"
                  required
                  :rules="date"
                  type="date"
                  v-model="partner.start_date"
                />
                <p v-if="fetchErrorMsgs.start_date" class="text-caption text-negative">{{ fetchErrorMsgs.start_date_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput
                  clearable
                  label="End Date *"
                  :options="(date) => (partner.start_date ? date > partner.start_date : true)"
                  required
                  :rules="date"
                  type="date"
                  v-model="partner.end_date"
                />
                <p v-if="fetchErrorMsgs.end_date" class="text-caption text-negative">{{ fetchErrorMsgs.end_date_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Nº Users *" required :rules="[...number, ...min(1)]" type="number" v-model="partner.num_users" />
                <p v-if="fetchErrorMsgs.num_users" class="text-caption text-negative">{{ fetchErrorMsgs.num_users_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseSelect
                  :clearable="false"
                  hide-hint
                  hint="Click Enter ↵ to add"
                  label="Domains *"
                  multiple
                  new-value-mode="add-unique"
                  :rules="required"
                  v-model="partner.domains"
                />
                <p v-if="fetchErrorMsgs.domains" class="text-caption text-negative">{{ fetchErrorMsgs.domains_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { todayDate } from 'src/utils/reuseFunctions'
import { date, min, number, required } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { usePartnerStore } from 'stores/partner'
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps(['id', 'show'])
const emit = defineEmits(['onCancel'])
const partnerStore = usePartnerStore()

const partner = reactive({
  partner_name: '',
  plans: null,
  start_date: '',
  end_date: '',
  num_users: undefined,
  domains: null
})
const dataShow = ref(props.show)

const singlepartnerInfo = computed(() => (Object.keys(partnerStore.partnerInfo).length > 0 ? partnerStore.partnerInfo : []))
const plansOptionsGetter = computed(() => (partnerStore.plansOptions.length > 0 ? [...new Set(partnerStore.plansOptions)] : []))
const fetchErrorMsgs = computed(() => partnerStore.error_msgs)

onMounted(async () => {
  if (props.id) {
    await partnerStore.fetchPartner({ partner_id: props.id })
    partner.partner_name = singlepartnerInfo.value.partner_name
    partner.start_date = singlepartnerInfo.value.start_date.replace(/-/g, '/')
    partner.end_date = singlepartnerInfo.value.end_date.replace(/-/g, '/')
    partner.domains = singlepartnerInfo.value.domains
    partner.num_users = singlepartnerInfo.value.num_users
    partner.plans = plansOptionsGetter.value.filter((plan) => singlepartnerInfo.value.plans.includes(plan.value))
  }
})
async function onSubmit() {
  const data = {
    partner_name: partner.partner_name,
    start_date: partner.start_date.replace(/\//g, '-'),
    end_date: partner.end_date.replace(/\//g, '-'),
    num_users: partner.num_users,
    domains: partner.domains
  }
  if (partner.plans && partner.plans.length > 0) {
    data.plans = partner.plans.map((plan) => plan.value)
  }
  if (props.id) {
    data.partner_id = props.id
    await partnerStore.updatePartner(compareFunction('partner', data, singlepartnerInfo.value))
  } else {
    await partnerStore.createPartner(data)
  }
  if (partnerStore.statusOfApi) {
    partner.partner_name = ''
    partner.plans = null
    partner.start_data = ''
    partner.end_date = ''
    partner.num_users = 0
    partner.domains = null
    onCancel()
  }
}
function onCancel() {
  emit('onCancel', { show: true })
}
</script>
