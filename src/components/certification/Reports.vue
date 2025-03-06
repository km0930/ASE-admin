<template>
  <q-card dark flat>
    <q-card-section>
      <div class="flex items-center justify-between">
        <div class="text-subtitle1">
          <q-btn color="white" flat icon="arrow_back" round size="sm" @click="emit('onCancel', { show: false })" />
          Report
        </div>
        <q-btn flat icon="filter_list" round>
          <q-menu dark>
            <q-list bordered dark style="width: 18rem">
              <q-item>
                <BaseInput :bottom-slots="false" :debounce="1000" label="Search" style="width: 100%" v-model="search" />
              </q-item>
              <q-separator dark />
              <p class="q-mb-none q-mt-sm text-center">Status:</p>
              <q-item>
                <q-item-section><q-radio color="white" dark label="Passed" val="status:pass" v-model="filter" /></q-item-section>
                <q-item-section><q-radio color="white" dark label="Failed" val="status:fail" v-model="filter" /></q-item-section>
              </q-item>
              <q-separator dark />
              <p class="q-mb-none q-mt-sm text-center">Certified:</p>
              <q-item>
                <q-item-section><q-radio color="white" dark label="Yes" val="certified:true" v-model="filter" /></q-item-section>
                <q-item-section><q-radio color="white" dark label="No" val="certified:false" v-model="filter" /></q-item-section>
              </q-item>
              <q-separator dark />
              <q-item>
                <q-btn class="col-grow q-mr-xs" color="orange" dense label="Reset" outline @click="onReset" />
                <q-btn class="col-grow q-ml-xs" color="positive" dense label="Filter" @click="onFilter" />
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <q-separator dark spaced />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-table :columns="columns" :rows="reports" dark :filter="search" flat hide-bottom row-key="email">
        <template v-slot:body-cell-email="props">
          <q-td :props="props" @click="showEmail(props.row)" style="cursor: pointer">
            <!-- <q-btn color="primary" label="Show Email" no-caps size="12px" @click="showEmail(props.row.email)" /> -->
            <span>{{ props.row.email }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-icon v-if="props.row.status === 'pass' || props.row.status === 'passed'" color="positive" name="check_circle" size="xs">
              <q-tooltip>Passed</q-tooltip>
            </q-icon>
            <q-icon v-else color="red" name="cancel" size="xs">
              <q-tooltip>Failed</q-tooltip>
            </q-icon>
          </q-td>
        </template>
        <template v-slot:body-cell-certified="props">
          <q-td :props="props">
            <q-icon v-if="props.row.certified" color="positive" name="check_circle" size="xs">
              <q-tooltip>Already Certified</q-tooltip>
            </q-icon>
            <span v-else-if="props.row.status === 'fail'">N/A</span>
            <q-btn v-else color="primary" label="Issue Certificate" no-caps size="12px" @click="onIssueCertificate(props.row)" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="white"
              flat
              icon="fas fa-video"
              round
              size="sm"
              :style="{ visibility: props.row.meet ? 'visible' : 'hidden' }"
              @click="onVideoDialog(props.row)"
            >
              <q-tooltip>Video</q-tooltip>
            </q-btn>
            <q-btn
              v-if="props.row.challenges.length"
              color="white"
              flat
              icon="fas fa-chess"
              round
              size="sm"
              @click="onChallengesDialog(props.row)"
            >
              <q-tooltip>Challenges</q-tooltip>
            </q-btn>
            <q-btn
              :style="{ visibility: props.row.questions.length ? 'visible' : 'hidden' }"
              color="white"
              flat
              icon="fas fa-circle-question"
              round
              size="sm"
              @click="onQuestionsDialog(props.row)"
            >
              <q-tooltip>Questions</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card-section>

    <q-dialog v-model="issueCertificateDialog">
      <q-card dark style="width: 30rem; max-width: 90vw">
        <q-card-section class="text-body1">Issue Certificate</q-card-section>
        <q-form greedy @submit="issueCertificate">
          <q-card-section class="text-body2">
            <p>- Please ensure that you have reviewed the questions and answers thoroughly.</p>
            <p>- This process will calculate a final score and generate the certificate based on that score.</p>
          </q-card-section>
          <q-card-actions>
            <q-btn color="orange" class="col-grow" label="Cancel" outline v-close-popup />
            <q-btn
              color="positive"
              class="col-grow"
              :disable="certificate.certified"
              :label="certificate.certified ? 'Already Certified' : 'Issue Certificate'"
              type="submit"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showVideo">
      <q-card dark style="width: 600px; max-width: 90vw">
        <q-card-section class="text-body1">Video</q-card-section>
        <video v-if="showVideo" controls ref="videoPlayer" width="600" height="320">
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </q-card>
    </q-dialog>

    <q-dialog v-model="challengesDialog">
      <q-card dark style="width: 600px; max-width: 90vw">
        <q-card-section class="text-body1">Challenges</q-card-section>
        <q-item v-for="(challenge, index) in challenges" :key="index">
          <q-item-section avatar>
            <q-icon v-if="challenge.status === 'pass'" color="green" name="check_circle" size="xs">
              <q-tooltip>Passed</q-tooltip>
            </q-icon>
            <q-icon v-if="challenge.status === 'fail'" color="red" name="cancel" size="xs">
              <q-tooltip>Failed</q-tooltip>
            </q-icon>
            <q-icon v-if="challenge.status === 'not attempted'" color="warning" name="circle" size="xs">
              <q-tooltip>Not Attempted</q-tooltip>
            </q-icon>
          </q-item-section>
          <q-item-section>{{ challenge.challenge }}</q-item-section>
          <q-item-section>
            <q-linear-progress color="orange" rounded size="sm" track-color="black" :value="challenge.score / 100">
              <q-tooltip>Score: {{ challenge.score }}</q-tooltip>
            </q-linear-progress>
          </q-item-section>
          <q-separator dark spaced />
        </q-item>
      </q-card>
    </q-dialog>

    <q-dialog v-model="questionsDialog">
      <q-card dark style="width: 800px; max-width: 90vw">
        <q-card-section class="text-body1">Questions</q-card-section>
        <q-card-section>
          <q-list v-for="(question, index) in questions" bordered dark :key="index">
            <q-expansion-item group="questions" :label="question.question">
              <q-card dark>
                <q-card-section class="q-pb-none">
                  <BaseInput label="Answer" readonly type="textarea" v-model="question.answer" />
                  <div class="flex justify-around q-gutter-sm">
                    <BaseInput
                      v-for="(score, index) in scores"
                      :key="index"
                      :label="score.label"
                      :max="100"
                      :min="0"
                      style="width: 100px"
                      type="number"
                      :modelValue="question.ai_eval_result ? question.ai_eval_result[score.value] : null"
                      @update:model-value="updateStateScores(question, score.value, $event)"
                    />
                  </div>
                </q-card-section>
                <transition appear enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
                  <q-card-actions v-if="JSON.stringify(resultsBeforeChange[index]) !== JSON.stringify(question.ai_eval_result)">
                    <q-btn class="col-grow" color="positive" label="Update" @click="onUpdateScores(question)" />
                  </q-card-actions>
                </transition>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import BaseInput from 'src/components/shared/BaseInput.vue'
import { useCertificationStore } from 'src/stores'
import { computed, ref } from 'vue'

const certificationStore = useCertificationStore()
const props = defineProps({
  reportData: { type: Object, required: true }
})
const emit = defineEmits(['reportDetail', 'onCancel'])
const reports = computed(() => certificationStore.reports)

const columns = ref([
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'score', label: 'Scored', field: 'score', format: (val) => val?.toFixed(2) || 0, sortable: true },
  { name: 'total_score', label: 'Total Score', field: 'total_score', format: (val) => val?.toFixed(2) || 0, sortable: true },
  { name: 'percentage', label: 'Percentage', field: 'percentage', format: (val) => (val?.toFixed(2) || 0) + '%', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'certified', label: 'Certified', field: 'certified', align: 'center' },
  { name: 'first_name', label: 'First Name', field: 'first_name', align: 'center' },
  { name: 'last_name', label: 'Last Name', field: 'last_name', align: 'center' },
  {
    name: 'Date',
    label: 'Date',
    field: 'created_on',
    align: 'center',
    format: (val) => {
      if (val) {
        const date = new Date(val)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      } else {
        return ''
      }
    }
  },
  { name: 'actions', field: 'actions', align: 'center' }
])
const videoPlayer = ref(null)
const challenges = ref([])
const challengesDialog = ref(false)
const certificate = ref({})
const issueCertificateDialog = ref(false)
const questions = ref([])
const questionsDialog = ref(false)
const reportRow = ref({})
const resultsBeforeChange = ref([])
const scores = ref([
  { label: 'Accuracy', value: 'accuracy' },
  { label: 'Creativity', value: 'creativity' },
  { label: 'Comprehensive', value: 'comprehensive' },
  { label: 'Examples', value: 'examples' },
  { label: 'Originality', value: 'originality' },
  { label: 'Relevance', value: 'relevance' }
])
const filter = ref('')
const search = ref('')
const showVideo = ref(false)
const videoUrl = ref('')

function onChallengesDialog(row) {
  challengesDialog.value = true
  challenges.value = row.challenges
}
function showEmail(row) {
  emit('reportDetail', { show: true, row })
}
async function onVideoDialog(row) {
  showVideo.value = true
  videoUrl.value = row.meet
  if (videoPlayer.value) {
    videoPlayer.value.play()
  }
}
function onQuestionsDialog(row) {
  questionsDialog.value = true
  reportRow.value = row
  questions.value = row.questions
  resultsBeforeChange.value = row.questions.map((question) => question.ai_eval_result)
}

function onReset() {
  filter.value = ''
  search.value = ''
  certificationStore.certificationReport({ test: props.reportData.sk })
}

function onFilter() {
  const data = { test: props.reportData.sk }
  if (search.value) {
    data.query = search.value
  }
  const filterType = filter.value?.split(':')
  if (filter.value && filterType[0] === 'status') {
    data.status = filterType[1]
  }
  if (filter.value && filterType[0] === 'certified') {
    data.certified = JSON.parse(filterType[1])
  }
  certificationStore.certificationReport(data)
}

function onIssueCertificate(row) {
  issueCertificateDialog.value = true
  certificate.value = row
}

async function issueCertificate() {
  const data = {
    email: certificate.value.email,
    test: props.reportData.sk
  }
  await certificationStore.certificationIssue(data).then(() => {
    issueCertificateDialog.value = false
  })
}

function updateStateScores(question, label, value) {
  const payload = {
    question: question.id,
    email: reportRow.value.email,
    result: {
      ...question.ai_eval_result,
      [label]: parseInt(value)
    }
  }
  certificationStore.UPDATE_STATE_SCORES(payload)
}

function onUpdateScores(question) {
  const payload = {
    question: question.id,
    email: reportRow.value.email,
    test: reportRow.value.pk,
    result: question.ai_eval_result
  }
  certificationStore.updateScores(payload).then(() => {
    resultsBeforeChange.value = questions.value.map((question) => question.ai_eval_result)
  })
}
</script>
