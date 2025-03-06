<template>
  <q-card dark flat>
    <q-card-section>
      <div class="flex items-center justify-between">
        <div class="text-subtitle1">
          <q-btn color="white" flat icon="arrow_back" round size="sm" @click="$emit('onCloseDetail', { show: false })" />
          Report Detail ({{ props.reportData.first_name }} {{ props.reportData.last_name }})
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none row" style="display: flex; align-items: normal; justify-content: center">
      <q-card dark class="detail-card">
        <q-card-section class="text-body1">Details</q-card-section>
        <q-table :rows="tableData" :columns="columns" dark flat row-key="index">
          <template v-slot:body-cell-certified="tableData">
            <q-td>
              <q-icon v-if="tableData.certified" color="positive" name="check_circle" size="xs">
                <q-tooltip>Already Certified</q-tooltip>
              </q-icon>
              <span v-else-if="tableData.status === 'fail'">N/A</span>
              <q-btn v-else color="primary" label="Issue Certificate" no-caps size="12px" @click="onIssueCertificate(props.row)" />
            </q-td>
          </template>
        </q-table>
        <q-btn
          v-if="props.reportData.attachment_url"
          class="download-attachment"
          color="positive"
          label="Download attachment file"
          no-caps
          size="12px"
          @click="downloadFile(props.reportData.attachment_url)"
        />
      </q-card>
      <q-card dark class="detail-card">
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
      <q-card dark class="detail-card">
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
      <q-card dark class="detail-card">
        <q-card-section class="text-body1">Video</q-card-section>
        <video controls ref="videoPlayer" width="600px" height="320px">
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </q-card>
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
  </q-card>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import { useCertificationStore } from 'src/stores'
import { computed, onMounted, ref } from 'vue'

const certificationStore = useCertificationStore()
const props = defineProps({
  reportData: { type: Object, required: true }
})

const formattedDate = computed(() => {
  const date = new Date(props.reportData.created_on)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const columns = ref([
  { name: 'index', label: '#', field: 'index', align: 'left' },
  { name: 'label', label: 'Label', field: 'label', align: 'left' },
  { name: 'value', label: 'Value', field: 'value', align: 'left' }
])
const challenges = ref([])
const certificate = ref({})
const issueCertificateDialog = ref(false)
const questions = ref([])
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
const videoUrl = ref('')
const tableData = ref([])
const videoPlayer = ref(null)

onMounted(() => {
  challenges.value = props.reportData.challenges
  videoUrl.value = props.reportData.meet
  reportRow.value = props.reportData
  questions.value = props.reportData.questions
  resultsBeforeChange.value = props.reportData.questions.map((question) => question.ai_eval_result)
  tableData.value = [
    {
      index: 1,
      label: 'Email',
      value: props.reportData.email
    },
    {
      index: 2,
      label: 'First Name',
      value: props.reportData.first_name
    },
    {
      index: 3,
      label: 'Last Name',
      value: props.reportData.last_name
    },
    {
      index: 4,
      label: 'Date',
      value: formattedDate.value
    },
    {
      index: 5,
      label: 'Status',
      value: props.reportData.status
    },
    {
      index: 6,
      label: 'Scored',
      value: props.reportData.score
    },
    {
      index: 7,
      label: 'Total Score',
      value: props.reportData.total_score ? props.reportData.total_score : 0
    },
    {
      index: 8,
      label: 'Percentage',
      value: props.reportData.percentage ? props.reportData.percentage : 0
    },
    {
      index: 9,
      label: 'Certified',
      value: props.reportData.certified ? 'Yes' : 'No'
    }
  ]
})

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
    test: props.reportData.pk,
    result: question.ai_eval_result
  }
  certificationStore.updateScores(payload).then(() => {
    resultsBeforeChange.value = questions.value.map((question) => question.ai_eval_result)
  })
}
async function downloadFile(url) {
  window.open(url, '_blank')
}
</script>

<style lang="sass" scoped>
.q-card.detail-card
  width: 600px
  max-width: 90vw
  margin: 20px

.q-card.detail-card .detail-item
  padding: 10px 40px
  display: flex
  align-items: center
.download-attachment
  margin: 20px
  float: right
</style>
