<template>
  <q-list class="row">
    <q-item class="col-12">
      <q-item-section>
        <div class="flex items-end q-gutter-x-md">
          <span>Achievement Type:</span>
          <q-option-group v-model="achievementSelected" :options="achievementTypeOptions" color="white" dark dense inline />
        </div>
      </q-item-section>
    </q-item>
    <q-item class="col-12" v-show="achievementSelected">
      <q-item-section style="flex-direction: row">
        <BaseSelect
          class="col-grow"
          label="Select Delivery *"
          :loading="isLoading"
          :options="fetchDeliveryOptionsList.filter((option) => option.type === achievementSelected)"
          searchable
          :showMore="fetchDeliveryOptionsList.length < totalDeliveries"
          v-model="delivery_id"
          @loadMoreItems="loadMoreDeliveries"
          @popup-show="deliveryOptionsAction"
          @search="searchDelivery"
          @update:model-value="$emit('update:delivery_id', delivery_id)"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12" v-show="achievementSelected">
      <q-item-section style="flex-direction: row">
        <q-btn
          :disabled="delivery_id"
          :icon="achievementSelected && isCreateDelivery && !delivery_id ? 'expand_less' : 'expand_more'"
          label="Create Delivery"
          outline
          @click="onCreateDelivery"
        />
      </q-item-section>
    </q-item>
    <q-item class="col-12">
      <q-item-section>
        <q-form greedy ref="formRef" @submit="saveDelivery">
          <q-slide-transition>
            <q-stepper
              v-if="achievementSelected && isCreateDelivery && !delivery_id"
              active-color="white"
              alternative-labels
              animated
              dark
              done-color="positive"
              header-nav
              ref="stepper"
              v-model="step"
            >
              <q-step :name="1" title="Design" icon="brush" :done="step > 1" :header-nav="step > 1">
                <q-list class="row">
                  <q-item class="col-12">
                    <q-item-section>
                      <BaseSelect
                        label="Select Design *"
                        :loading="!fetchErrorMsgsDesigns.status"
                        :options="listDesignsOption"
                        :rules="[(val) => !!val || 'Please select a design or upload a file']"
                        :showMore="listDesignsOption.length < totalDesigns"
                        v-model="delivery.designId"
                        @loadMoreItems="loadMoreDesigns"
                        @popup-show="designOptionsAction"
                        @update:model-value="isAchievementActive()"
                      />
                    </q-item-section>
                  </q-item>
                  <q-item class="col-12">
                    <q-item-section>
                      <BaseFile
                        accept=".png, image/png"
                        :disable="Boolean(delivery.designId)"
                        label="Upload Design File"
                        v-model="design_file"
                        @update:model-value="uploadFile"
                      />
                    </q-item-section>
                  </q-item>
                  <p class="q-mx-auto q-my-md text-caption text-warning">
                    Select a design or upload a file. If you upload a file, the design will be created automatically.
                  </p>
                </q-list>
                <p v-if="fetchErrorMsgs.step1" class="text-caption text-negative">{{ fetchErrorMsgs.step1_msg }}</p>
              </q-step>
              <q-step
                :name="2"
                title="Detail"
                icon="loupe"
                :done="step > 2"
                :header-nav="step > 2"
                :disable="!delivery.designId && !design_file"
              >
                <q-item class="col-12">
                  <q-item-section>
                    <BaseSelect
                      label="Select Detail *"
                      :loading="!fetchErrorMsgsDetails.status"
                      :options="listDetailsOption"
                      :rules="[(val) => !!val || 'Please select a detail or create one']"
                      :showMore="listDetailsOption.length < totalDetails"
                      v-model="delivery.detailId"
                      @loadMoreItems="loadMoreDetails"
                      @popup-show="detailOptionsAction"
                      @update:model-value="isAchievementActive()"
                    />
                  </q-item-section>
                </q-item>
                <q-btn
                  class="block q-mx-auto q-my-sm"
                  :disabled="Boolean(delivery.detailId)"
                  :icon="createDetails && !delivery.detailId ? 'expand_less' : 'expand_more'"
                  label="Create Details"
                  outline
                  @click="onCreateDetails"
                />
                <p v-if="fetchErrorMsgs.step2" class="text-caption text-negative">{{ fetchErrorMsgs.step2_msg }}</p>
                <q-slide-transition>
                  <q-list class="row" v-if="createDetails && !delivery.detailId">
                    <q-item class="col-12">
                      <q-item-section>
                        <BaseInput label="Title *" v-model="details.title" />
                        <p v-if="fetchErrorMsgs.title" class="text-caption text-negative">{{ fetchErrorMsgs.title_msg }}</p>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-sm-4 col-xs-12">
                      <q-item-section>
                        <BaseInput label="Duration *" :min="1" type="number" v-model="details.duration" />
                        <p v-if="fetchErrorMsgs.duration" class="text-caption text-negative">{{ fetchErrorMsgs.duration_msg }}</p>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-sm-4 col-xs-12">
                      <q-item-section>
                        <BaseSelect
                          label="Duration Type *"
                          :options="duration_type_options"
                          style="width: 100%"
                          v-model="details.duration_type"
                        />
                        <p v-if="fetchErrorMsgs.duration_type" class="text-caption text-negative">{{ fetchErrorMsgs.duration_type_msg }}</p>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-sm-4 col-xs-12">
                      <q-item-section>
                        <BaseSelect label="Level *" :options="level_options" style="width: 100%" v-model="details.level" />
                        <p v-if="fetchErrorMsgs.level" class="text-caption text-negative">{{ fetchErrorMsgs.level_msg }}</p>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12">
                      <q-item-section>
                        <BaseEditor label="Description *" v-model="details.description" />
                        <p v-if="fetchErrorMsgs.description" class="text-caption text-negative">{{ fetchErrorMsgs.description_msg }}</p>
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12">
                      <q-item-section>
                        {{ console.log(details.criteria) }}
                        <BaseEditor label="Earning Criteria *" v-model="details.criteria" />
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12">
                      <q-item-section>
                        <BaseInput
                          hint="Enter any search query and click send button. Eg: DevSecOps, Docker, AWS, etc..."
                          label="Search *"
                          sendButton
                          v-model="querySearch"
                          @send="searchQueryData"
                        />
                      </q-item-section>
                    </q-item>
                    <q-item class="col-12">
                      <q-item-section>
                        <BaseSelect
                          :disable="!queriedSkillsData.length"
                          label="Skills *"
                          multiple
                          :options="queriedSkillsData"
                          v-model="details.skills"
                        />
                        <p v-if="fetchErrorMsgs.skills" class="text-caption text-negative">{{ fetchErrorMsgs.skills_msg }}</p>
                      </q-item-section>
                    </q-item>

                    <q-btn
                      class="q-mx-auto q-my-sm"
                      color="positive"
                      :disable="disableSaveDetails"
                      label="Save Details"
                      outline
                      @click="onSubmitDetails()"
                    />
                  </q-list>
                </q-slide-transition>
                <p class="q-mt-lg text-caption text-center text-warning">
                  {{
                    createDetails && !delivery.detailId
                      ? 'Click on Save Details button to save the details. Once saved, you can select it from the list.'
                      : 'Select a detail from the list or create a new one.'
                  }}
                </p>
              </q-step>
              <q-step
                :name="3"
                title="Others"
                icon="add"
                :done="step > 3"
                :header-nav="step > 3"
                :disable="(!delivery.designId && !design_file) || !delivery.detailId"
              >
                <q-list class="row">
                  <q-item class="col-12">
                    <q-item-section>
                      <BaseInput
                        label="Email From Name *"
                        required
                        v-model="delivery.emailFromName"
                        @update:model-value="isAchievementActive"
                      />
                      <p v-if="fetchErrorMsgs.emailFromName" class="text-caption text-negative">{{ fetchErrorMsgs.emailFromName_msg }}</p>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-12">
                    <q-item-section>
                      <BaseInput
                        label="Mail subject *"
                        required
                        :rules="maxLength(200)"
                        v-model="delivery.mailSubject"
                        @update:model-value="isAchievementActive"
                      />
                      <p v-if="fetchErrorMsgs.mailSubject" class="text-caption text-negative">{{ fetchErrorMsgs.mailSubject_msg }}</p>
                    </q-item-section>
                  </q-item>
                  <q-item class="col-12">
                    <q-item-section>
                      <BaseSelect
                        label="Template *"
                        :loading="!fetchErrorMsgsTemplates.status"
                        :options="listTemplatesOption"
                        required
                        :rules="[(val) => !!val || 'Please select a template.']"
                        v-model="delivery.emailTemplateId"
                        @popup-show="templateOptionsAction"
                        @update:model-value="isAchievementActive"
                      />
                      <p v-if="fetchErrorMsgs.emailTemplateId" class="text-caption text-negative">
                        {{ fetchErrorMsgs.emailTemplateId_msg }}
                      </p>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-step>
              <template v-slot:navigation>
                <q-stepper-navigation class="text-right">
                  <q-btn v-if="step !== 1" class="q-mr-sm" color="orange" @click="$refs.stepper.previous()">Back</q-btn>
                  <q-btn
                    v-if="step !== 3"
                    color="positive"
                    :disable="(step === 1 && !delivery.designId) || (step === 2 && !delivery.detailId)"
                    @click="$refs.formRef.validate().then((valid) => (valid ? $refs.stepper.next() : null))"
                  >
                    Next
                  </q-btn>
                  <q-btn
                    v-if="step === 3"
                    color="positive"
                    :disable="!delivery.emailFromName || !delivery.mailSubject || !delivery.emailTemplateId"
                    type="submit"
                  >
                    Save
                  </q-btn>
                </q-stepper-navigation>
              </template>
            </q-stepper>
          </q-slide-transition>
        </q-form>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import BaseEditor from 'components/shared/BaseEditor.vue'
import BaseFile from 'components/shared/BaseFile.vue'
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { useCourseStore, useDeliveryStore } from 'src/stores'
import { filteredItemBasedOnKey } from 'src/utils/reuseFunctions'
import { maxLength } from 'src/utils/rules'
import { computed, onMounted, ref, watch } from 'vue'

const emit = defineEmits(['isActive', 'update:achievementSelected', 'update:achievementType', 'update:data', 'update:delivery_id'])
const props = defineProps({
  achievementType: { type: String, default: 'None' },
  data: { type: Object },
  title: { type: String, default: '', required: true },
  type: { type: String, default: '', required: true }
})

const achievementSelected = ref(props.achievementType)
const achievementTypeOptions = ref([])
const createDetails = ref(false)
const delivery = ref({
  type: '',
  designId: '',
  detailId: '',
  emailFromName: 'AppSecEngineer',
  emailTemplateId: '',
  mailSubject: 'Congratulations! AppSecEngineer Issued A New'
})
const delivery_id = ref(null)
const design_file = ref(null)
const details = ref({
  title: props.title,
  duration: '',
  level: '',
  duration_type: null,
  description: '',
  criteria: `<p>The ${props.title} from the Learning Path has been created to test the user's knowledge of the concept. This is a ${props.type} challenge where the user needs to understand the vulnerable implementation and figure out how to fix it.</p><p>By completing this challenge successfully, the user has demonstrated skills and a deep understanding of the concept.</p>`,
  skills: []
})
const duration_type_options = ref([
  { label: 'Minute', value: 'Minute' },
  { label: 'Hour', value: 'Hour' },
  { label: 'Day', value: 'Day' },
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
  { label: 'Year', value: 'Year' }
])
const isCreateDelivery = ref(false)
const level_options = ref([
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Experienced', value: 'Experienced' },
  { label: 'Professional', value: 'Professional' },
  { label: 'NA', value: 'NA' }
])
const queriedSkillsData = ref([])
const querySearch = ref('')
const searchDeliveryTerm = ref(undefined)
const step = ref(1)
const successResponseDesignId = ref('')
const successResponseDetailId = ref('')

const courseStore = useCourseStore()
const deliveryStore = useDeliveryStore()

const showDesignDataGetter = computed(() => courseStore.showDesignData)
const statusOfS3Getter = computed(() => courseStore.statusOfS3)

const deliverySuccessInfoGetter = computed(() => deliveryStore.deliverySuccessInfo)
const fetchDeliveryOptionsList = computed(() => deliveryStore.listOptionsDelivery)
const fetchDetailInfoGetter = computed(() => deliveryStore.detailInfo)
const fetchErrorMsgs = computed(() => deliveryStore.error_msgs)
const fetchErrorMsgsDesigns = computed(() => deliveryStore.error_msgs_designs)
const fetchErrorMsgsDetails = computed(() => deliveryStore.error_msgs_details)
const fetchErrorMsgsTemplates = computed(() => deliveryStore.error_msgs_templates)
const fetchStatusOfApi = computed(() => deliveryStore.statusOfApi)
const isLoading = computed(() => deliveryStore.loading)
const listDesignsOption = computed(() => (deliveryStore.listDesigns.length > 0 ? [...new Set(deliveryStore.listDesigns)] : []))
const listDetailSkillsOption = computed(() => (deliveryStore.listDetailSkills.length > 0 ? [...new Set(deliveryStore.listDetailSkills)] : []))
const listDetailsOption = computed(() => (deliveryStore.listDetails.length > 0 ? [...new Set(deliveryStore.listDetails)] : []))
const listTemplatesOption = computed(() => (deliveryStore.listTemplates.length > 0 ? [...new Set(deliveryStore.listTemplates)] : []))
const totalDeliveries = computed(() => deliveryStore.totalDeliveries)
const totalDetails = computed(() => deliveryStore.totalDetails)
const totalDesigns = computed(() => deliveryStore.totalDesigns)
const disableSaveDetails = computed(() => {
  return (
    !details.value.title ||
    !details.value.duration ||
    !details.value.duration_type ||
    !details.value.level ||
    !details.value.description ||
    !hasContent(details.value.criteria) ||
    !details.value.skills.length
  )
})

watch(achievementSelected, (value) => {
  if (value) {
    delivery.value.mailSubject = `Congratulations! AppSecEngineer Issued A New ${value}`
    emit('update:achievementSelected', value)
  }
})

onMounted(async () => {
  if (props.type === 'certification') {
    achievementTypeOptions.value = [{ label: 'Certificate', value: 'certificate' }]
    achievementSelected.value = 'certificate'
  }
  if (props.type === 'challenge') {
    achievementTypeOptions.value = [
      { label: 'Badge', value: 'badge' },
      { label: 'None', value: null }
    ]
    achievementSelected.value = 'badge'
  }
  if (props.type === 'course') {
    achievementTypeOptions.value = props.data.isEvent ? [{ label: 'None', value: null }] : [{ label: 'Badge', value: 'badge' }]
    achievementSelected.value = props.data.isEvent ? null : 'badge'
  }
  if (props.type === 'training') {
    achievementTypeOptions.value = [
      { label: 'Certificate', value: 'certificate' },
      { label: 'None', value: null }
    ]
    achievementSelected.value = 'certificate'
  }
  if (props.type === 'None') {
    achievementSelected.value = null
  }

  if (!fetchDeliveryOptionsList.value.length) {
    await loadMoreDeliveries({ length: 80, startIndex: 0 })
  }

  if (props.data.delivery_id) {
    delivery_id.value =
      fetchDeliveryOptionsList.value.find((delivery) => [props.data.delivery_id, props.data.delivery_id.value].includes(delivery.value)) ||
      props.data.delivery_id
  }

  if (props.data.delivery_id && props.type === 'challenge') {
    const deliveryId = props.data.delivery_id.value || props.data.delivery_id
    delivery_id.value = filteredItemBasedOnKey(deliveryId, fetchDeliveryOptionsList.value)
  }

  delivery.value.mailSubject = `Congratulations! AppSecEngineer Issued A New ${achievementSelected.value}`
})
function isAchievementActive() {
  const isActive = Boolean(
    (['badge', 'certificate'].includes(achievementSelected.value) && !delivery_id.value && !isCreateDelivery.value) ||
      (isCreateDelivery.value &&
        (!delivery.value.designId || !design_file.value) &&
        !delivery.value.detailId &&
        (!delivery.value.mailSubject || !delivery.value.emailFromName || !delivery.value.emailTemplateId))
  )
  emit('isActive', isActive)
}
async function loadMoreDeliveries() {
  await deliveryStore.fetchDeliveries({
    pagination: { length: 80, search_term: searchDeliveryTerm.value, startIndex: fetchDeliveryOptionsList.value.length }
  })
  delivery_id.value =
    fetchDeliveryOptionsList.value.find((delivery) => [props.data.delivery_id, props.data.delivery_id?.value].includes(delivery?.value)) ||
    props.data.delivery_id
}
async function deliveryOptionsAction() {
  if (!fetchDeliveryOptionsList.value.length) {
    await deliveryStore.fetchDeliveries({ pagination: { length: 80 } })
  }
}
async function searchDelivery(query) {
  searchDeliveryTerm.value = query
  await deliveryStore.fetchDeliveries({
    pagination: { length: 80, search_term: query },
    reset: true
  })
}
function onCreateDelivery() {
  isCreateDelivery.value = !isCreateDelivery.value

  if (listDesignsOption.value.length === 0) {
    deliveryStore.fetchlistDesigns({ type: achievementSelected.value })
  }
  if (listDetailsOption.value.length === 0) {
    deliveryStore.fetchlistDetails()
  }
  isAchievementActive()
}
async function loadMoreDesigns() {
  await deliveryStore.fetchlistDesigns({ length: 80, startIndex: listDesignsOption.value.length, type: achievementSelected.value })
}
function designOptionsAction() {
  if (listDesignsOption.value.length === 0) {
    deliveryStore.fetchlistDesigns({ type: achievementSelected.value })
  }
}
async function uploadFile(file) {
  successResponseDesignId.value = ''
  await courseStore.fetchDesigns()

  const customFields = Object.assign({}, showDesignDataGetter.value.fields)

  if (showDesignDataGetter.value.url && showDesignDataGetter.value.fields.key) {
    customFields['Content-Type'] = file.type
    const form = {}
    Object.entries(customFields).forEach(([field, value]) => (form[field] = value))
    form['Content-Type'] = file.type
    form.file = file

    const signedUrl = showDesignDataGetter.value.url
    await courseStore.S3UploadFile({ signedUrl, form })

    if (statusOfS3Getter.value === 204) {
      const signedUrlData = showDesignDataGetter.value.url + showDesignDataGetter.value.fields.key
      await courseStore.uploadCreateDesign({ title: props.title, url: signedUrlData })
        .then((res) => {
          delivery.value.designId = res.data.data
          successResponseDesignId.value = res.data.data
          isAchievementActive()
        })
        .catch((err) => console.error(err))
    }
  }
}
function onCreateDetails() {
  createDetails.value = !createDetails.value
  const errMsgs = {}
  errMsgs.detailId = false
  errMsgs.step2_msg = ''
  deliveryStore.errorMsgReset(errMsgs)
}
async function loadMoreDetails() {
  await deliveryStore.fetchlistDetails({ length: 80, startIndex: listDetailsOption.value.length })
}
async function detailOptionsAction() {
  if (listDetailsOption.value.length === 0) {
    await deliveryStore.fetchlistDetails()
  }
}
async function searchQueryData() {
  await deliveryStore.fetchDetailSkills({
    query: querySearch.value,
    startIndex: 0,
    length: 2000
  })
  queriedSkillsData.value = listDetailSkillsOption.value.map((skillData) => ({
    label: skillData.title,
    value: skillData.skillId,
    languageCode: skillData.languageCode
  }))
}
async function onSubmitDetails() {
  const data = {
    title: details.value.title,
    duration: parseInt(details.value.duration),
    level: details.value.level.value,
    duration_type: details.value.duration_type.value,
    description: details.value.description,
    earningCriteriaHTML: details.value.criteria.replace(/(\n+)/, '<br />'),
    type: ['certification', 'training'].includes(props.type) ? 'challenge' : props.type,
    skills: details.value.skills
  }

  if (details.value.skills.length > 0) {
    data.skills = details.value.skills.map((skill) => ({
      title: skill.label,
      skillId: skill.value,
      languageCode: skill.languageCode
    }))
  }

  await deliveryStore.addDetail(data).then(() => {
    delivery.value.detailId = listDetailsOption.value[0]
  })

  if (fetchDetailInfoGetter.value.data) {
    successResponseDetailId.value = fetchDetailInfoGetter.value.data.id
    delivery.value.detailId = successResponseDetailId.value
  }
}
async function templateOptionsAction() {
  await deliveryStore.errorMsgResetTemplates({ status: false })
  if (listTemplatesOption.value.length === 0) {
    await deliveryStore.fetchlistTemplates()
  } else {
    await deliveryStore.errorMsgResetTemplates({ status: true })
  }
}
async function saveDelivery() {
  const data = {
    title: props.title,
    _type: achievementSelected.value,
    mailSubject: delivery.value.mailSubject,
    emailFromName: delivery.value.emailFromName
  }
  data.designId = delivery.value.designId?.value || delivery.value.designId
  data.detailId = delivery.value.detailId?.value || delivery.value.detailId
  data.emailTemplateId = delivery.value.emailTemplateId?.value || delivery.value.emailTemplateId

  await deliveryStore.createDelivery(data)
  if (fetchStatusOfApi.value) {
    delivery_id.value = { label: deliverySuccessInfoGetter.value.data.title, value: deliverySuccessInfoGetter.value.data.id }
    emit('update:delivery_id', delivery_id.value)
    isCreateDelivery.value = false
  }
}
function hasContent(htmlString) {
  let textContent = htmlString.replace(/<[^>]*>/g, '')
  textContent = textContent.trim()
  return textContent.length > 0
}
</script>
