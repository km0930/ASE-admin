<template>
  <ParticularSubjectInfo
    :tableData="fetchFilterDetailedSubjectGetter"
    :title="title"
    @actionItem="actionItem"
    @actionItemCrud="actionItemCrud"
    @actionItemDelete="actionItemDelete"
    @actionItemDetachData="actionItemDetach"
    @changeLabStatus="changeLabStatus"
    @createPage="showDialogData($event)"
  />
  <q-separator dark />
  <q-dialog v-model="bar2" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white" style="width: 600px; max-width: 80vw">
      <q-bar>
        <q-icon name="style" />
        <div>Action Items</div>

        <q-space />

        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-list>
          <q-item
            clickable
            v-ripple
            style="border: 1px solid white"
            @click="actionItem(action.value)"
            v-for="(action, index) in actionItems"
            :key="index"
          >
            <q-item-section>{{ action.label }}</q-item-section>
            <q-item-section avatar>
              <q-icon color="secondary" :name="action.icon" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog v-model="createMediaStatus" v-if="createMediaStatus" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white" style="width: 500px; max-width: 80vw">
      <q-bar>
        <q-icon name="create" />
        <div>{{ typeOfValue }} Media</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <q-list bordered>
        <q-form greedy @submit="onSubmitMedia()">
          <q-card-section>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput autofocus :maxlength="150" required :rules="maxLength(150)" v-model="media.name" />
                  <p v-if="fetchErrorMsgsMedia.media_name" class="text-caption text-negative">
                    {{ fetchErrorMsgsMedia.media_name_msg }}
                  </p>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput label="Duration (In Seconds)" required type="number" v-model="media.duration" />
                  <p v-if="fetchErrorMsgsMedia.media_ttl" class="text-caption text-negative">{{ fetchErrorMsgsMedia.media_ttl_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput label="URL" required type="textarea" v-model="media.url" />
                  <p v-if="fetchErrorMsgsMedia.media_url" class="text-caption text-negative">{{ fetchErrorMsgsMedia.media_url_msg }}</p>
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseToggle label="Is Active" v-model="media.is_active" />
                  <p v-if="media.is_active === 'N/A'" class="text-caption text-negative">Please select Is Active toggle field</p>
                  <p v-if="fetchErrorMsgsMedia.is_active" class="text-caption text-negative">{{ fetchErrorMsgsMedia.is_active_msg }}</p>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
            <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
          </q-card-actions>
        </q-form>
      </q-list>
    </q-card>
  </q-dialog>

  <q-dialog v-model="createVedioStatus" v-if="createVedioStatus" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white" style="width: 600px; max-width: 80vw">
      <q-bar>
        <q-icon name="create" />
        <div>{{ typeOfValue }} Video</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <q-form greedy @submit="onSubmitVideo()">
        <q-card-section class="q-px-xl">
          <q-video v-if="singleVideoInfo.vimeo_url && typeOfValue === 'Update'" :ratio="16 / 9" :src="singleVideoInfo.vimeo_url" />
        </q-card-section>
        <q-card-section>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus :maxlength="150" required :rules="maxLength(150)" v-model="video.name" />
                <p v-if="fetchErrorMsgsVideo.vid_name" class="text-caption text-negative">{{ fetchErrorMsgsVideo.vid_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12 q-mb-md">
              <q-item-section class="items-center">
                <BaseToggle label="Is Live" v-model="video.is_live" />
              </q-item-section>
              <q-item-section class="items-center">
                <BaseToggle label="Is Free" v-model="video.is_free" />
              </q-item-section>
              <q-item-section class="items-center">
                <BaseToggle label="Is Active" v-model="video.is_active" />
              </q-item-section>
            </q-item>
            <q-item v-if="fetchErrorMsgsVideo.is_active || fetchErrorMsgsVideo.is_free" class="col-12">
              <q-item-section>
                <p v-if="fetchErrorMsgsVideo.is_active" class="text-caption text-negative">{{ fetchErrorMsgsVideo.is_active_msg }}</p>
                <p v-if="fetchErrorMsgsVideo.is_free" class="text-caption text-negative">{{ fetchErrorMsgsVideo.is_free_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item v-if="video.is_live" class="col-12">
              <q-item-section class="col-8">
                <BaseInput
                  label="Live URL"
                  prefix="https://vimeo.com/event/"
                  required
                  :rules="[(val) => /^\d+$/.test(val) || 'Please enter a valid Live ID']"
                  suffix="/embed"
                  v-model="video.live_id"
                />
              </q-item-section>
              <q-item-section class="col-4">
                <BaseInput hint="In minutes" label="Duration estimate" required type="number" v-model="video.live_duration" />
              </q-item-section>
            </q-item>
            <q-item v-else class="col-12">
              <q-item-section>
                <BaseSelect
                  label="Folder"
                  :options="listVimeoFolders"
                  sendButton
                  :showMore="this.loadPage < this.totalPage"
                  v-model="video.folder"
                  @send="findVideosByFolder($event)"
                  @loadMoreItems="loadMoreDetails"
                />
              </q-item-section>
            </q-item>
            <q-item v-if="showURL" class="col-12">
              <q-item-section>
                <BaseSelect
                  label="Video Name"
                  :loading="showMoreLoadingGetter"
                  :options="listVimeoVideos"
                  :showMore="showMoreGetter"
                  v-model="vid_data"
                  @loadMoreItems="loadMoreItems"
                />
                <p v-if="fetchErrorMsgsVideo.vid_url" class="text-caption text-negative">{{ fetchErrorMsgsVideo.vid_url_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
          <q-btn class="col-grow" color="positive" type="submit">{{ typeOfValue }}</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="downloadSubjectStatus" v-if="downloadSubjectStatus" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white" style="width: 500px; max-width: 80vw">
      <q-bar>
        <q-icon name="create" />
        <div>{{ typeOfValue }} Download</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <q-form greedy @submit="onSubmitDownload()">
        <q-card-section class="row">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus :maxlength="250" required :rules="maxLength(150)" v-model="download.name" />
                <p v-if="fetchErrorMsgsDownload.download_name" class="text-caption text-negative">
                  {{ fetchErrorMsgsDownload.download_name_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="URL" :maxlength="550" required type="textarea" v-model="download.url" />
                <p v-if="fetchErrorMsgsDownload.download_url" class="text-caption text-negative">
                  {{ fetchErrorMsgsDownload.download_url_msg }}
                </p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseToggle label="Is Active" v-model="download.is_active" />
                <p v-if="download.is_active === 'N/A'" class="text-caption text-negative">Please select Is Active toggle field</p>
                <p v-if="fetchErrorMsgsDownload.is_active" class="text-caption text-negative">
                  {{ fetchErrorMsgsDownload.is_active_msg }}
                </p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
          <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="quizSubjectStatus" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white text-center" style="width: 900px; max-width: 90vw">
      <q-bar>
        <q-icon name="create" />
        <div>{{ typeOfValue }} Quiz</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup />
      </q-bar>
      <BaseToggle label="Custom Challenge" v-model="isAiChallenge" class="q-mt-md" />
      <q-form greedy @submit="onSubmitQuiz()">
        <q-card-section v-if="!isAiChallenge">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput autofocus :maxlength="150" required :rules="maxLength(150)" v-model="quiz.name" />
                <p v-if="fetchErrorMsgsQuiz.quiz_name" class="text-caption text-negative">{{ fetchErrorMsgsQuiz.quiz_name_msg }}</p>
                <p v-if="fetchErrorMsgsQuiz.quiz_ttl" class="text-caption text-negative">{{ fetchErrorMsgsQuiz.quiz_ttl_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="URL" required type="textarea" v-model="quiz.url" />
                <p v-if="fetchErrorMsgsQuiz.quiz_url" class="text-caption text-negative">{{ fetchErrorMsgsQuiz.quiz_url_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-12 justify-between">
              <q-item-section>
                <BaseToggle label="Is Active" v-model="quiz.is_active" />
                <p v-if="quiz.is_active === 'N/A'" class="text-caption text-negative">Please select Is Active toggle field</p>
                <p v-if="fetchErrorMsgsQuiz.is_active" class="text-caption text-negative">{{ fetchErrorMsgsQuiz.is_active_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions v-if="!isAiChallenge">
          <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
          <q-btn class="col-grow" color="positive" type="submit">Save</q-btn>
        </q-card-actions>

        <q-card v-if="isAiChallenge" class="bg-primary text-white text-center">
          <q-card-section>
            <q-list>
              <q-item class="flex column">
                <q-item-section>
                  <div class="flex justify-around">
                    <BaseSelect label="Language" :options="languages" v-model="selectedLanguage" />
                    <BaseInput label="Framework" v-model="selectedFramework" />
                    <BaseSelect label="Difficulty" :options="difficultyOptions" v-model="selectedDifficulty" />
                    <div class="flex q-mb-md q-pb-xs">
                      <q-btn no-caps @click="filterChallenges" color="positive" class="col-grow q-mr-sm">Apply</q-btn>
                      <q-btn no-caps @click="clearFilterChallenges" color="orange" class="col-grow">Clear</q-btn>
                    </div>
                  </div>
                </q-item-section>
                <q-item-section>
                  <BaseSelect label="List of challenges *" class="q-mx-sm" :options="filteredChallenges" v-model="selectedChallenges" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions>
            <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
            <q-btn class="col-grow" color="positive" type="submit">{{ typeOfValue }}</q-btn>
          </q-card-actions>
        </q-card>
      </q-form>
    </q-card>
  </q-dialog>

  <q-dialog v-model="createLabStatusAttach" v-if="createLabStatusAttach" persistent transition-show="flip-down" transition-hide="flip-up">
    <q-card class="bg-primary text-white" style="width: 500px; max-width: 80vw">
      <q-bar>
        <q-icon name="create" />
        <div>Attach</div>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>
      <q-card-section>
        <q-form greedy @submit="onSubmitLabAttach()">
          <q-card-section class="q-pa-sm">
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section>
                  <BaseSelect
                    label="Select Lab/Challenge"
                    :options="[
                      { value: 'Lab', label: 'Lab' },
                      { value: 'Challenge', label: 'Challenge' }
                    ]"
                    v-model="isChallenge"
                  />
                </q-item-section>
              </q-item>
              <q-item v-if="isChallenge" class="col-12">
                <q-item-section>
                  <BaseSelect
                    :label="isChallenge.label === 'Lab' ? 'List Labs *' : 'List Challenges Labs *'"
                    :loading="showMoreLoadingGetterLabs"
                    :options="fetchListLabsOptions"
                    searchable
                    :showMore="showMoreGetterLabs"
                    v-model="labs_data_select"
                    @clear="resetFilter"
                    @loadMoreItems="loadMoreItemsLabs"
                    @popup-show="checkValue"
                    @search="searchFilter"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseToggle label="Is Active" v-model="labs_is_active" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions v-if="labs_data_select && isChallenge.label">
            <q-btn class="col-grow" color="orange" outline v-close-popup>Cancel</q-btn>
            <q-btn class="col-grow" color="positive" type="submit">Attach</q-btn>
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import BaseToggle from 'components/shared/BaseToggle.vue'
import ParticularSubjectInfo from 'components/subject/ParticularSubjectInfo'
import { useAiChallengesStore, useDownloadStore, useLabStore, useLabsStore, useMediaStore, useQuizStore, useSubjectStore, useVideoStore } from 'src/stores'
import { urlSafeBase64Decode, urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { maxLength } from 'src/utils/rules'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const actionItems = ref([
  { label: 'Create Media', value: 'createMedia', icon: 'format_size' },
  { label: 'Videos', value: 'vedios', icon: 'format_size' },
  { label: 'Downloads', value: 'downloads', icon: 'delete' },
  { label: 'Quiz', value: 'quiz', icon: 'print' },
  { label: 'Lab', value: 'lab', icon: 'print' }
])
const languages = ref(['Java', 'Python', 'Javascript', 'C#', 'Ruby', 'Go', 'Kubernetes YAML', 'Terraform'])
const difficultyOptions = ref(['Basic', 'Intermediate', 'Advanced'])
// const awsOuId = ref('')
const bar2 = ref(false)
const cloudType = ref('')
const customChallenge = ref(false)
const createLabStatus = ref(false)
const createLabStatusAttach = ref(false)
const createMediaStatus = ref(false)
const createVedioStatus = false
const download = { name: '', url: '', id: '', is_active: true }
const downloadSubjectStatus = false
const imageName = ref('')
const isChallenge = ref('')
const isAiChallenge = ref(false)
const isCloud = ref(false)
const lab = ref({ update_lab_id: null, region: null, approxTime: 0, labTime: 0, configuration: 'e2-small', documentation: [] })
const labs_data_select = ref(null)
const labs_is_active = ref(true)
const media = ref({ name: '', url: '', duration: '', size: '', id: '', is_active: true })
const quiz = ref({ name: '', url: '', duration: '', id: '', is_active: true })
const aiquiz = ref({ name: '', duration: '', id: '', quiz_type: 'aiquiz' })
const saveFolderId = ref('')
const searchLabData = ref('')
// const showImages = ref(false)
const showURL = ref(false)
// const subject = ref({ subject_name: '', description: '', event_id: urlSafeBase64Decode(route.params.courseId) })
const typeOfValue = ref('Create')
const vid_data = ref('')
const video = ref({ name: '', id: '', is_free: false, is_active: true, is_live: false, live_id: '', live_duration: 0 })
const selectedChallenges = ref([])
const selectedLanguage = ref(null)
const selectedFramework = ref(null)
const selectedDifficulty = ref(null)
const filteredChallenges = ref([])
const showChallenge = ref(false)
const quizSubjectStatus = ref(false)

const aiChallenges = useAiChallengesStore()
const labStore = useLabStore()
const mediaStore = useMediaStore()
const downloadStore = useDownloadStore()
const quizStore = useQuizStore()
const videoStore = useVideoStore()
const subjectStore = useSubjectStore()
const labsStore = useLabsStore()

const fetchFilterDetailedSubjectGetter = computed(() => subjectStore.filteredDetailedSubjectInfo)
const fetchErrorMsgsMedia = computed(() => mediaStore.error_msgs)
const singleMediaInfo = computed(() => (Object.keys(mediaStore.mediaInfo).length > 0 ? mediaStore.mediaInfo : []))
const fetchErrorMsgsQuiz = computed(() => quizStore.error_msgs)
const singleQuizInfo = computed(() => (Object.keys(quizStore.quizInfo).length > 0 ? quizStore.quizInfo : []))
const fetchErrorMsgsDownload = computed(() => downloadStore.error_msgs)
const singleDownloadInfo = computed(() => (Object.keys(downloadStore.downloadInfo).length > 0 ? downloadStore.downloadInfo : []))
const statusOfAPIDownload = computed(() => downloadStore.apiStatus)
const fetchErrorMsgsVideo = computed(() => videoStore.error_msgs)
const listVimeoFolders = computed(() => (videoStore.videmoFolderOptions.length > 0 ? [...new Set(videoStore.videmoFolderOptions)] : []))
const listVimeoVideos = computed(() => (videoStore.videmoVideoOptions.length > 0 ? [...new Set(videoStore.videmoVideoOptions)] : []))
const showMoreGetter = computed(() => videoStore.showMore)
const showMoreLoadingGetter = computed(() => videoStore.showMoreLoading)
const singleVideoInfo = computed(() => (Object.keys(videoStore.videoInfo).length > 0 ? videoStore.videoInfo : []))
const fetchListLabsOptions = computed(() => (labsStore.listLabsOptions.length > 0 ? [...new Set(labsStore.listLabsOptions)] : []))
const fetchLoadMoreTypeLabGetter = computed(() => labsStore.loadMoreTypeLab)
const labPaginationKeyForwardLabs = computed(() => labsStore.paginationKey)
const showMoreGetterLabs = computed(() => labsStore.showMore)
const showMoreLoadingGetterLabs = computed(() => labsStore.showMoreLoading)
const getChitImageConfig = computed(() => labStore.chitImageConfig)
const getInstructionsList = computed(() => (labStore.allInstructionsList.length > 0 ? labStore.allInstructionsList : []))
const getLabID = computed(() => labStore.labId)
const single_lab_data = computed(() => (Object.keys(labStore.lab).length > 0 ? labStore.lab : []))
const singleLabInfo = computed(() => (Object.keys(labStore.lab).length > 0 ? labStore.lab : []))
const loadPage = computed(() => videoStore.loadPage)

async function filterChallenges() {
  const payload = {
    language: selectedLanguage.value,
    framework: selectedFramework.value,
    difficulty: selectedDifficulty.value
  }

  await aiChallenges.filterAiChallenges(payload)
  filteredChallenges.value = aiChallenges.filteredChallenges
}

function clearFilterChallenges() {
  selectedLanguage.value = null
  selectedFramework.value = null
  selectedDifficulty.value = null
  filteredChallenges.value = []
}
onMounted(() => {
  title.value = `${urlSafeBase64Decode(route.params.courseName)} / ${urlSafeBase64Decode(route.params.subjectName)}`
  const data = {
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  filterActionItem(data)
  labsStore.disableLabsWithSameId({ event_id: urlSafeBase64Decode(route.params.courseId) })
})
watch(imageName, (newValue) => {
  if (newValue) {
    lab.value.imageName = newValue
    labStore.fetchChitImageConfig(newValue.value)
  }
})
watch(isChallenge, () => {
  labsStore.resetLabsList()
  labs_data_select.value = null
})
watch(getChitImageConfig, (newValue) => {
  if (newValue) {
    if (singleLabInfo.value.configuration) {
      lab.value.configuration = singleLabInfo.value.configuration
    } else {
      lab.value.configuration = newValue
    }
  }
})
watch(getLabID, (newValue) => {
  labID.value = newValue
})

function resetFilter() {
  labsStore.resetLabsList()
  const data = { pagination: {}, reset: true }
  if (isChallenge.value !== 'Lab') {
    data.pagination = { type: 'challenge' }
  }
  labsStore.fetchLabs(data)
}
function checkValue() {
  if (!fetchListLabsOptions.value.length) {
    resetFilter()
  }
}
async function searchFilter(event) {
  if (event) {
    searchLabData.value = event
    const data = {
      pagination: {
        pk: 'lab',
        query: event
      },
      reset: true
    }
    if (isChallenge.value === 'Challenge') {
      data.pagination.pk = 'challenge'
    }
    await labsStore.fetchSearchLabs(data)
  } else {
    callLabsChallenges()
  }
}
function callLabsChallenges() {
  labs_data_select.value = null
  labsStore.resetLabsList()
  const data = { pagination: {}, reset: true }
  if (isChallenge.value !== 'Lab') {
    data.pagination = { type: 'challenge' }
  }
  labsStore.fetchLabs(data)
}
function showDialogData(event) {
  if (event.show) {
    lab.value = { update_lab_id: null, region: null, approxTime: 0, labTime: 0, configuration: '' }
    resetData()
    bar2.value = true
  } else {
    bar2.value = false
  }
}
async function actionItem(data) {
  typeOfValue.value = 'Create'
  resetData()
  bar2.value = false
  if (data === 'createMedia') {
    media.value = { name: '', url: '', duration: '', size: '', id: '', is_active: true }
    mediaStore.errorMsgResetMedia({
      status: true,
      media_name: false,
      media_name_msg: '',
      media_url: false,
      media_url_msg: '',
      media_ttl: false,
      media_ttl_msg: '',
      embed_size: false,
      embed_size_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    createMediaStatus.value = true
  } else if (data === 'vedios') {
    video.value = {
      name: '',
      id: '',
      is_free: false,
      is_active: true,
      is_live: false,
      vid_url: '',
      vid_ttl: ''
    }
    videoStore.errorMsgResetVideo({
      status: true,
      vid_name: false,
      vid_name_msg: '',
      vid_ttl: false,
      vid_ttl_msg: '',
      vid_url: false,
      vid_url_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    showURL.value = false
    videoStore.SET_PAGE(1)
    videoStore.CLEAR_VIMEO_FOLDERS()
    videoStore.fetchVimeoFolders()
    createVedioStatus.value = true
  } else if (data === 'downloads') {
    download.value = { name: '', url: '', id: '', is_active: true }
    downloadStore.errorMsgResetDownload({
      status: true,
      download_name: false,
      download_name_msg: '',
      download_url: false,
      download_url_msg: '',
      logo_name: false,
      logo_name_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    downloadSubjectStatus.value = true
  } else if (data === 'quiz') {
    quizStore.errorMsgResetQuiz({
      status: true,
      quiz_name: false,
      quiz_name_msg: '',
      quiz_url: false,
      quiz_url_msg: '',
      quiz_ttl: false,
      quiz_ttl_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    quizSubjectStatus.value = true
  } else if (data === 'lab') {
    isChallenge.value = null
    labs_data_select.value = null
    labsStore.resetLabsList()
    createLabStatusAttach.value = true
  } else if (data === 'custom_challenge') {
    customChallenge.value = true
    showChallenge.value = true
  }
}
// async function resetDataLabsOptions(event) {
//   searchLabData.value = ''
//   if (event) {
//     labs_data_select.value = null
//     searchLabData.value = ''
//     if (isChallenge.value === 'Lab') {
//       const data = {
//         pagination: {},
//         reset: true
//       }
//       labsStore.fetchLabs(data)
//     } else {
//       const data = {
//         pagination: { type: 'challenge' },
//         reset: true
//       }
//       labsStore.fetchLabs(data)
//     }
//   }
// }
function resetData() {
  createMediaStatus.value = false
  createVedioStatus.value = false
  quizSubjectStatus.value = false
  downloadSubjectStatus.value = false
  createLabStatus.value = false
  createMediaStatus.value = false
  createVedioStatus.value = false
  quizSubjectStatus.value = false
  downloadSubjectStatus.value = false
  createLabStatus.value = false
}
async function onSubmitMedia() {
  const data = {
    media_name: media.value.name,
    media_url: urlSafeBase64Encode(media.value.url),
    media_ttl: parseInt(media.value.duration * 60),
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId),
    is_active: media.value.is_active
  }

  if (media.value.id) {
    data.media_id = media.value.id
    mediaStore.updateMedia(data)
  } else {
    await mediaStore.createNewMedia(data)
  }

  createMediaStatus.value = !fetchErrorMsgsMedia.value.status
  media.value = { name: '', url: '', duration: '', size: '', id: '', is_active: true }

  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
  }, 2000)
}
async function onSubmitVideo() {
  const data = {
    vid_name: video.value.name,
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId),
    is_free: video.value.is_free,
    is_live: video.value.is_live,
    is_active: video.value.is_active,
    vid_url: vid_data.value?.value ? urlSafeBase64Encode(vid_data.value) : undefined,
    vid_ttl: vid_data.value?.ttl ? vid_data.value?.ttl : undefined
  }

  if (video.value.is_live) {
    data.vid_url = urlSafeBase64Encode('https://vimeo.com/event/' + video.value.live_id + '/embed')
    data.vid_ttl = parseInt(video.value.live_duration)
  }

  if (video.value.id) {
    data.vid_id = video.value.id
    videoStore.updateVideo(data)
  } else {
    await videoStore.createNewVideo(data)
    video.value = { name: '', id: '', is_free: false, is_active: true }
  }

  createVedioStatus.value = !fetchErrorMsgsVideo.value.status

  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
  }, 2000)
}
async function onSubmitDownload() {
  const data = {
    download_name: download.value.name,
    download_url: urlSafeBase64Encode(download.value.url),
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId),
    is_active: download.value.is_active
  }
  if (download.value.id) {
    data.download_id = download.value.id
    downloadStore.updateDownload(data)
  } else {
    await downloadStore.createDownload(data)
    if (statusOfAPIDownload.value) {
      download.value = { name: '', url: '', id: '', is_active: true }
    }
  }

  if (fetchErrorMsgsDownload.value.status) {
    downloadSubjectStatus.value = false
  } else {
    if (statusOfAPIDownload.value) {
      download.value = { name: '', url: '', id: '', is_active: true }
    }
    downloadSubjectStatus.value = true
  }

  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
  }, 2000)
}
async function onSubmitQuiz() {
  const data = {
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  if (isAiChallenge.value) {
    data.quiz_name = 'AI Quiz: ' + selectedChallenges.value.name
    data.quiz_id = selectedChallenges.value._key
    data.quiz_type = 'aiquiz'
  } else {
    data.quiz_name = quiz.value.name
    data.quiz_url = urlSafeBase64Encode(quiz.value.url)
    data.is_active = quiz.value.is_active
  }

  if (quiz.value.id) {
    data.quiz_id = quiz.value.id
    await quizStore.updateQuiz(data)
  } else if (aiquiz.value.id) {
    data.quiz_id = aiquiz.value.id
    await quizStore.updateQuiz(data)
  } else {
    await quizStore.createNewQuiz(data)
  }

  quiz.value = { name: '', url: '', duration: '', id: '', is_active: true }
  aiquiz.value = { name: '', duration: '', id: '', quiz_type: 'aiquiz' }

  if (fetchErrorMsgsQuiz.value.status) {
    quizSubjectStatus.value = false
  } else {
    download.value = { name: '', url: '', id: '', is_active: true }
    quizSubjectStatus.value = true
  }

  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
  }, 2000)
}
function findVideosByFolder(event) {
  vid_data.value = ''
  if (event.show) {
    const data = {
      folder_id: event.value
    }
    saveFolderId.value = data
    videoStore.fetchVideosByFolder(data)
    showURL.value = true
  }
}
async function loadMoreItems() {
  await videoStore.fetchVideosByFolderPaginations(saveFolderId.value)
}
async function loadMoreItemsLabs() {
  let data = {}
  if (fetchLoadMoreTypeLabGetter.value === 'lab') {
    data = {
      pagination: {
        pagination: labPaginationKeyForwardLabs.value
      },
      reset: false
    }
    if (isChallenge.value === 'Challenge') {
      data.pagination.type = 'challenge'
    }
    await labsStore.fetchLabs(data)
  } else if (fetchLoadMoreTypeLabGetter.value === 'search') {
    data = {
      pagination: {
        pk: 'lab',
        pagination: labPaginationKeyForwardLabs.value,
        query: searchLabData.value
      },
      reset: false
    }
    if (isChallenge.value === 'Challenge') {
      data.pagination.type = 'challenge'
    }
    await labsStore.fetchSearchLabs(data)
  }
}
async function onSubmitLabAttach() {
  await labsStore.attachLabToSubject({
    lab_id: labs_data_select.value?.value || labs_data_select.value,
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    is_active: labs_is_active.value
  })
  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
    labsStore.disableLabsWithSameId({ event_id: urlSafeBase64Decode(route.params.courseId) })
    labs_data_select.value = null
  }, 2000)
  createLabStatusAttach.value = false
}
async function changeLabStatus(info) {
  const attachdata = { subject_id: urlSafeBase64Decode(route.params.subjectId), lab_id: info.status }
  await labStore.actionChangeLabStatus(attachdata)

  const searchIndex = fetchFilterDetailedSubjectGetter.value.lab.map((e) => e.id).indexOf(info.status)
  subjectStore.resetDataSubjectLab({ index: searchIndex, status: info.is_active })
}
async function filterActionItem(payload) {
  await subjectStore.fetchFilteredDetailedSubjectInformation(payload)
}
async function actionItemDelete(event) {
  const data = {
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  if (event.type === 'download') {
    data.download_id = event.id
  } else if (event.type === 'vid') {
    data.vid_id = event.id
  } else if (event.type === 'media') {
    data.media_id = event.id
  } else if (event.type === 'quiz') {
    data.quiz_id = event.id
  } else if (event.type === 'lab') {
    data.lab_id = event.id
  } else if (event.type === 'aiquiz') {
    data.quiz_id = event.id
  }
  const url = event.type + '/delete'
  await subjectStore.deleteGeneric({ data: data, url: url })
  lab.value = { update_lab_id: null, region: null, approxTime: 0, labTime: 0, configuration: '' }

  const dataFilter = {
    subject_id: urlSafeBase64Decode(route.params.subjectId),
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  filterActionItem(dataFilter)
}
async function actionItemDetach(event) {
  const data = {
    lab_id: event.id,
    subject_id: urlSafeBase64Decode(route.params.subjectId)
  }
  await labsStore.detachLabToSubject(data)
  await labsStore.disableLabsWithSameId({ event_id: urlSafeBase64Decode(route.params.courseId) })
  setTimeout(() => {
    const dataFilter = {
      subject_id: urlSafeBase64Decode(route.params.subjectId),
      event_id: urlSafeBase64Decode(route.params.courseId)
    }
    filterActionItem(dataFilter)
  }, 2000)
}
async function actionItemCrud(event) {
  typeOfValue.value = 'Update'
  if (event.type === 'download') {
    downloadStore.errorMsgResetDownload({
      status: true,
      download_name: false,
      download_name_msg: '',
      download_url: false,
      download_url_msg: '',
      logo_name: false,
      logo_name_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    const data = {
      download_id: event.id
    }
    await downloadStore.fetchDownloadById(data)
    download.value.name = singleDownloadInfo.value.download_name
    download.value.url = singleDownloadInfo.value.download_url
    download.value.is_active = singleDownloadInfo.value.is_active
    download.value.id = singleDownloadInfo.value.download_id
    downloadSubjectStatus.value = true
  } else if (event.type === 'vid') {
    videoStore.errorMsgResetVideo({
      status: true,
      vid_name: false,
      vid_name_msg: '',
      vid_ttl: false,
      vid_ttl_msg: '',
      vid_url: false,
      vid_url_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
    const data = {
      vid_id: event.id
    }
    await videoStore.fetchVideoById(data)
    videoStore.fetchVimeoFolders()
    createVedioStatus.value = true
    video.value.name = singleVideoInfo.value.vid_name
    video.value.id = singleVideoInfo.value.vid_id
    video.value.is_free = singleVideoInfo.value.is_free || false
    video.value.is_active = singleVideoInfo.value.is_active
    video.value.is_live = singleVideoInfo.value.is_live
    video.value.vid_url = singleVideoInfo.value.vid_url
    video.value.vid_ttl = singleVideoInfo.value.vid_ttl / 60
    if (video.value.is_live) {
      video.value.live_id = singleVideoInfo.value.vid_url.match(/\/(\d+)\//)[1] // Take the number between the slashes
      video.value.live_duration = singleVideoInfo.value.vid_ttl / 60
    }
  } else if (event.type === 'media') {
    const data = {
      media_id: event.id
    }
    await mediaStore.fetchMediaById(data)
    media.value.name = singleMediaInfo.value.media_name
    media.value.url = singleMediaInfo.value.media_url
    media.value.duration = singleMediaInfo.value.media_ttl / 60
    media.value.size = singleMediaInfo.value.embed_size
    media.value.id = singleMediaInfo.value.media_id
    media.value.is_active = singleMediaInfo.value.is_active

    createMediaStatus.value = true
    mediaStore.errorMsgResetMedia({
      status: true,
      media_name: false,
      media_name_msg: '',
      media_url: false,
      media_url_msg: '',
      media_ttl: false,
      media_ttl_msg: '',
      embed_size: false,
      embed_size_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
  } else if (event.type === 'quiz') {
    const data = { quiz_id: event.id }
    await quizStore.fetchQuizById(data)
    quiz.value.name = singleQuizInfo.value.quiz_name
    quiz.value.url = singleQuizInfo.value.quiz_url
    quiz.value.duration = singleQuizInfo.value.quiz_ttl / 60
    quiz.value.id = singleQuizInfo.value.sk
    quiz.value.is_active = singleQuizInfo.value.is_active
    quizSubjectStatus.value = true

    aiquiz.value.name = singleQuizInfo.value.quiz_name
    aiquiz.value.id = singleQuizInfo.value.quiz_id
    aiquiz.value.quiz_type = singleQuizInfo.value.quiz_type

    quizStore.errorMsgResetQuiz({
      status: true,
      quiz_name: false,
      quiz_name_msg: '',
      quiz_url: false,
      quiz_url_msg: '',
      quiz_ttl: false,
      quiz_ttl_msg: '',
      subject_id: false,
      subject_id_msg: '',
      event_id: false,
      event_id_msg: '',
      is_active: false,
      is_active_msg: ''
    })
  } else if (event.type === 'lab') {
    const data = { lab_id: event.id }
    await labStore.fetchLab(data)
    await labStore.updatingLab(single_lab_data.value)
    lab.value.name = await singleLabInfo.value.name
    lab.value.approxTime = parseInt(singleLabInfo.value.approxTime)
    lab.value.description = await singleLabInfo.value.description
    lab.value.findImage = await singleLabInfo.value.imageId
    lab.value.update_lab_id = await singleLabInfo.value.id
    lab.value.region = singleLabInfo.value.regions.map((reg) => ({ label: reg, value: reg }))
    imageName.value = { label: singleLabInfo.value.imageId, value: singleLabInfo.value.imageId }

    isCloud.value = singleLabInfo.value.is_cloud
    cloudType.value = { label: singleLabInfo.value.cloud_type, value: singleLabInfo.value.cloud_type }
    lab.value.labTime = (await singleLabInfo.value.labTtl) / 60
    lab.value.configuration = await singleLabInfo.value.configuration
    if (singleLabInfo.value.documentations.length > 0) {
      const docinfo = []
      getInstructionsList.value.forEach((instr) => {
        singleLabInfo.value.documentations.forEach((selectedFile) => {
          if (instr.value === selectedFile) {
            docinfo.push({ label: instr.label, value: instr.value })
          }
        })
      })
      lab.value.documentation = docinfo
    }
    createLabStatus.value = true
  }
}
async function loadMoreDetails() {
  // Load more folders
  videoStore.SET_PAGE(loadPage.value + 1)
  await videoStore.fetchVimeoFolders()
}

</script>
