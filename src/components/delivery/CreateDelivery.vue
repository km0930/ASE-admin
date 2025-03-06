<template>
  <q-dialog v-model="dataShow" persistent>
    <q-card style="min-width: 500px" transition-show="flip-up" transition-hide="flip-down" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ title }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit="onSubmit()">
        <q-card-section class="q-pt-none">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus label="Title *" :maxlength="200" required :rules="maxLength(200)" v-model="delivery.title" />
                <p v-if="fetchErrorMsgs.title" class="text-caption text-negative">{{ fetchErrorMsgs.title_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect
                  label="Type *"
                  :options="deliveryTypeOptions"
                  :rules="required"
                  v-model="delivery.type"
                  @update:model-value="onSelectType"
                />
                <p v-if="fetchErrorMsgs._type" class="text-caption text-negative">{{ fetchErrorMsgs._type_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Mail subject *" :maxlength="200" required :rules="maxLength(200)" v-model="delivery.mailSubject" />
                <p v-if="fetchErrorMsgs.mailSubject" class="text-caption text-negative">{{ fetchErrorMsgs.mailSubject_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect
                  :disable="!delivery.type"
                  :hide-hint="!!delivery.type"
                  hint="Please select type to fill the design"
                  label="Design *"
                  :loading="!fetchErrorMsgsDesigns.status"
                  :options="listDesignsOption"
                  :rules="required"
                  :showMore="listDesignsOption.length < totalDesigns"
                  v-model="delivery.designId"
                  @loadMoreItems="loadMoreDesigns"
                  @popup-show="designOptionsAction"
                />
                <p v-if="fetchErrorMsgs.designId" class="text-caption text-negative">{{ fetchErrorMsgs.designId_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect
                  label="Details *"
                  :loading="!fetchErrorMsgsDetails.status"
                  :options="listDetailsOption"
                  :rules="required"
                  :showMore="listDetailsOption.length < totalDetails"
                  v-model="delivery.detailId"
                  @loadMoreItems="loadMoreDetails"
                  @popup-show="detailOptionsAction"
                />
                <p v-if="fetchErrorMsgs.detailId" class="text-caption text-negative">{{ fetchErrorMsgs.detailId_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect
                  label="Template *"
                  :loading="!fetchErrorMsgsTemplates.status"
                  :options="listTemplatesOption"
                  :rules="required"
                  v-model="delivery.emailTemplateId"
                  @popup-show="templateOptionsAction"
                />
                <p v-if="fetchErrorMsgs.emailTemplateId" class="text-caption text-negative">{{ fetchErrorMsgs.emailTemplateId_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Email From Name *" :maxlength="50" required :rules="shortName" v-model="delivery.emailFromName" />
                <p v-if="fetchErrorMsgs.emailFromName" class="text-caption text-negative">{{ fetchErrorMsgs.emailFromName_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn
            class="col-grow"
            color="positive"
            :disable="
              !delivery.title ||
              !delivery.type ||
              !delivery.mailSubject ||
              !delivery.designId ||
              !delivery.detailId ||
              !delivery.emailTemplateId ||
              !delivery.emailFromName
            "
            type="submit"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDeliveryStore } from 'app/src/stores'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { maxLength, required, shortName } from 'src/utils/rules'
import { compareFunction } from 'src/utils/validateSeralizer'
import { computed, onMounted, ref } from 'vue'

const props = defineProps(['id', 'show', 'title', 'selectedDesignInfo'])
const emit = defineEmits(['onCacel'])

const delivery = ref({
  title: '',
  type: undefined,
  mailSubject: '',
  designId: undefined,
  detailId: undefined,
  emailTemplateId: undefined,
  emailFromName: 'AppSec Engineer'
})
const deliveryTypeOptions = ref([
  { value: 'badge', label: 'Badge' },
  { value: 'certificate', label: 'Certificate' }
])
const dataShow = ref(props.show)

const deliveryStore = useDeliveryStore()

const fetchErrorMsgs = computed(() => deliveryStore.error_msgs)
const fetchErrorMsgsDesigns = computed(() => deliveryStore.error_msgs_designs)
const fetchErrorMsgsDetails = computed(() => deliveryStore.error_msgs_details)
const fetchErrorMsgsTemplates = computed(() => deliveryStore.error_msgs_templates)
const fetchStatusOfApi = computed(() => deliveryStore.statusOfApi)
const listDesignsOption = computed(() => (deliveryStore.listDesigns.length > 0 ? [...new Set(deliveryStore.listDesigns)] : []))
const listDetailsOption = computed(() => (deliveryStore.listDetails.length > 0 ? [...new Set(deliveryStore.listDetails)] : []))
const listTemplatesOption = computed(() => (deliveryStore.listTemplates.length > 0 ? [...new Set(deliveryStore.listTemplates)] : []))
const singledeliveryInfo = computed(() => (Object.keys(deliveryStore.deliveryInfo).length > 0 ? deliveryStore.deliveryInfo : []))
const totalDetails = computed(() => deliveryStore.totalDetails)
const totalDesigns = computed(() => deliveryStore.totalDesigns)

onMounted(async () => {
  if (props.id) {
    await deliveryStore.fetchDelivery({ id: props.id })
    const deliveryInfo = singledeliveryInfo.value

    delivery.value.title = deliveryInfo.title
    delivery.value.type = deliveryTypeOptions.value.find((item) => item?.value === deliveryInfo._type)
    delivery.value.mailSubject = deliveryInfo.emailSubject
    delivery.value.emailFromName = deliveryInfo.emailFromName

    if (!listDesignsOption.value.length && delivery.value.type.value) {
      await deliveryStore.fetchlistDesigns({ type: delivery.value.type?.value })
    }
    delivery.value.designId = listDesignsOption.value.find((item) => item.value === deliveryInfo.designId) || deliveryInfo.designId

    if (!listDetailsOption.value.length) {
      await deliveryStore.fetchlistDetails()
    }
    delivery.value.detailId = listDetailsOption.value.find((item) => item.value === deliveryInfo.detailId) || deliveryInfo.detailId

    if (!listTemplatesOption.value.length) {
      await deliveryStore.fetchlistTemplates()
    }
    delivery.value.emailTemplateId =
      listTemplatesOption.value.find((item) => item.value === deliveryInfo.emailTemplateId) || deliveryInfo.emailTemplateId
  }
})
async function onSelectType() {
  delivery.value.mailSubject = `Congrats! Here is your ${delivery.value.type.label}!`
  designOptionsAction()
}
async function designOptionsAction() {
  if (!listDesignsOption.value.length) {
    await deliveryStore.fetchlistDesigns({ type: delivery.value.type.value })
  }
}
async function loadMoreDesigns() {
  await deliveryStore.fetchlistDesigns({ length: 80, startIndex: listDesignsOption.value.length, type: delivery.value.type.value })
}
async function detailOptionsAction() {
  if (listDetailsOption.value.length === 0) {
    await deliveryStore.fetchlistDetails()
  }
}
async function loadMoreDetails() {
}
async function templateOptionsAction() {
  if (listTemplatesOption.value.length === 0) {
    await deliveryStore.fetchlistTemplates()
  }
}
async function onSubmit() {
  const data = {
    title: delivery.value.title,
    _type: delivery.value.type.value,
    mailSubject: delivery.value.mailSubject,
    designId: delivery.value.designId.value,
    detailId: delivery.value.detailId.value,
    emailTemplateId: delivery.value.emailTemplateId.value,
    emailFromName: delivery.value.emailFromName
  }
  if (props.id) {
    data.Id = props.id
    await deliveryStore.updateDelivery(compareFunction('deliveryUpdate', data, singledeliveryInfo.value))
  } else {
    await deliveryStore.createDelivery(data)
  }
  if (fetchStatusOfApi.value) {
    delivery.value = {
      title: '',
      type: '',
      mailSubject: 'Congrats! Here is your Certificate',
      designId: '',
      detailId: '',
      emailTemplateId: '',
      emailFromName: 'AppSec Engineer'
    }
    onCancel()
  } else {
    emit('onCacel', { show: false })
  }
}
function onCancel() {
  emit('onCacel', { show: true })
}
</script>
