<template>
  <div>
    <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
      <q-card style="width: 1000px; max-width: 80vw" dark>
        <q-card-section>
          <q-bar class="bg-transparent text-subtitle1 text-weight-normal">
            <q-icon name="quiz" />
            &nbsp; Descriptive Questions
            <q-space />
            <q-btn flat icon="close" round @click="emit('onCancel')" />
          </q-bar>
          <q-separator dark />
        </q-card-section>

        <q-card-section>
          <div class="row items-center">
            <q-btn class="block q-mb-md" color="primary" label="Create" @click="createDialog()" />
            <q-btn
              class="block q-mb-md"
              color="primary"
              :label="isImporting ? 'Importing...' : 'Import json'"
              :disable="isImporting"
              @click="jsonFile?.click()"
            />
            <input v-show="false" type="file" ref="jsonFile" @change="handleUploadQuestionsFromJson" accept="application/json" />
          </div>
          <q-table
            :columns="columns"
            dark
            :rows="displayDescriptiveQuestions"
            flat
            hide-bottom
            :rows-per-page-options="[0]"
            style="max-height: 30vh"
          >
            <template v-slot:body-cell-title="props">
              <q-td :props="props">
                {{ props.row.title.length > 60 ? props.row.title.substring(0, 60) + '...' : props.row.title }}
                <q-tooltip v-if="props.row.title.length > 60">{{ props.row.title }}</q-tooltip>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn color="warning" flat icon="edit" round size="sm" @click="onUpdateQuestion(props.row.sk)">
                  <q-tooltip>Edit Question</q-tooltip>
                </q-btn>
                <q-btn color="negative" flat icon="delete" round size="sm" @click="onDeleteQuestion(props.row.sk)">
                  <q-tooltip>Delete Question</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:bottom-row>
              <q-tr v-if="hasLastValueKeys">
                <q-td :colspan="5" style="padding: 0">
                  <q-separator dark />
                  <div class="q-pa-md text-center">
                    <q-btn
                      icon="chevron_right"
                      label="Load More Questions"
                      style="border: 2px solid white; margin: auto"
                      @click="loadMore(last_value)"
                    />
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
          <Delete
            v-if="isDeleting"
            header="this question"
            :show="isDeleting"
            @confirmDelete="onSubmitDelete"
            @confirmDeleteCancel="isDeleting = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialogCreate" persistent>
      <q-card style="width: 800px; max-width: 80vw" dark>
        <q-card-section>
          <q-bar class="bg-transparent text-subtitle1 text-weight-normal">
            <q-icon :name="isUpdating ? 'update' : 'create'" />
            &nbsp; {{ isUpdating ? 'Update Descriptive Questions' : 'Create Descriptive Questions' }}
            <q-space />
            <q-btn flat icon="close" round @click="cancelDialogCreate" />
          </q-bar>
          <q-separator dark />
        </q-card-section>
        <q-form greedy @submit="onSubmit" v-if="isUpdating">
          <q-card-section>
            <q-list class="row">
              <q-item class="col-12">
                <q-item-section class="col-12">
                  <BaseSelect
                    autofocus
                    label="Learning Path *"
                    :rules="required"
                    :options="learningPathOptions"
                    v-model="question.learningPath"
                    style="padding-bottom: 0px; margin-right: 20px"
                  />
                </q-item-section>
                <!-- <q-btn class="col-4" color="positive" @click="generateDetails(question.learningPath)">Automatically generate</q-btn> -->
              </q-item>
              <q-item class="col-sm-6 col-xs-12" style="padding-top: 20px">
                <q-item-section>
                  <BaseSelect label="Proficiency *" :rules="required" :options="proficiencyOptions" v-model="question.proficiency" />
                </q-item-section>
              </q-item>
              <q-item class="col-sm-6 col-xs-12" style="padding-top: 20px">
                <q-item-section>
                  <BaseInput label="Score *" required :rules="[...min(0), ...max(100)]" type="number" v-model="question.score" />
                </q-item-section>
              </q-item>
              <q-item class="col-12">
                <q-item-section>
                  <BaseInput label="Title *" type="textarea" required v-model="question.title" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
          <q-card-actions>
            <q-btn class="col-grow" color="orange" outline @click="cancelDialogCreate">Cancel</q-btn>
            <q-btn class="col-grow" color="positive" type="submit">{{ isUpdating ? 'Update' : 'Create' }}</q-btn>
          </q-card-actions>
        </q-form>
        <q-card-section v-if="!isUpdating">
          <q-list class="row" style="display: flex; align-items: center; justify-content: space-between">
            <q-btn class="col-4" color="positive" @click="generateDetails()">Automatically generate</q-btn>
            <q-btn class="col-2" color="positive" @click="onSubmit">Submit</q-btn>
          </q-list>
          <q-list class="row">
            <p class="col-12 text-subtitle1 q-mt-lg q-mb-xs text-center">Choose one learning path for generating a question</p>
          </q-list>
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <BaseSelect label="Learning Path *" :rules="required" :options="learningPathOptions" v-model="question.learningPath" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="row" v-if="descriptiveQuestionDetail">
            <q-item class="col-12">
              <q-item-section>
                <BaseInput label="Title *" type="textarea" required :rules="required" v-model="question.title" />
              </q-item-section>
            </q-item>
          </q-list>
          <q-list class="row" v-if="descriptiveQuestionDetail">
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseSelect label="Proficiency *" :options="proficiencyOptions" required :rules="required" v-model="question.proficiency" />
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput
                  label="Score *"
                  :max="20"
                  :min="1"
                  required
                  :rules="[required, ...min(1), ...max(100)]"
                  type="number"
                  v-model="question.score"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import Delete from 'components/shared/Delete.vue'
import { Notify } from 'quasar'
import { useCertificationStore, useLearningPathStore } from 'src/stores'
import { max, min, required } from 'src/utils/rules'
import { computed, onMounted, ref, watch } from 'vue'

const props = defineProps(['id', 'show'])
const emit = defineEmits(['onCancel'])

const columns = ref([
  { name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true },
  {
    name: 'proficiency',
    label: 'Proficiency',
    field: 'proficiency',
    format: (val) => (val = val === 'Basic' ? 'Beginner' : val),
    align: 'left',
    sortable: true
  },
  { name: 'score', label: 'Score', field: 'score', align: 'left', sortable: true },
  { name: 'learningPath', label: 'Learning Path', field: 'learningPath', align: 'left', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'left', sortable: true }
])
const dataShow = ref(props.show)
const dialogCreate = ref(false)
const isUpdating = ref(false)
const isDeleting = ref(false)
const questionToDelete = ref(null)
const proficiencyOptions = ref([
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' }
])
const question = ref({
  title: '',
  scenario: '',
  proficiency: undefined,
  learningPath: undefined,
  score: undefined
})
const isImporting = ref(false)
const jsonFile = ref(null)

const certificationStore = useCertificationStore()
const learningPathStore = useLearningPathStore()

const learningPathOptions = computed(() => learningPathStore.learningPathOptions)
const descriptiveQuestionDetail = computed(() => learningPathStore.descriptiveQuestion)
const descriptiveQuestions = computed(() => certificationStore.descriptiveQuestions)
const last_value = computed(() => certificationStore.last_value)
const displayDescriptiveQuestions = computed(() => {
  const showQuestions = descriptiveQuestions.value.map((row) => {
    const descQuestion = {}
    descQuestion.title = row.title
    descQuestion.proficiency = row.proficiency
    descQuestion.score = row.score
    const matchedRow = learningPathOptions.value.find((item) => item.value === row.learning_path_id)
    descQuestion.learningPath = matchedRow.label
    descQuestion.sk = row.sk
    return descQuestion
  })
  return showQuestions
})
const hasLastValueKeys = computed(() => {
  return last_value.value
})

onMounted(async () => {
  const data = {}
  await learningPathStore.fetchLearningPathOptions()
  await certificationStore.listDescriptiveQuestion(data)
})
watch(descriptiveQuestionDetail, (newValue) => {
  if (newValue) {
    question.value.score = newValue.score
    question.value.proficiency = newValue.proficiency_level
    question.value.title = `Scenario: ${newValue.scenario}\n\nQuestion: ${newValue.question}`
  }
})
function createDialog() {
  dialogCreate.value = true
  question.value.score = null
  question.value.proficiency = undefined
}
function cancelDialogCreate() {
  question.value = { title: '', proficiency: undefined, learningPath: undefined, score: undefined }
  dialogCreate.value = false
  isUpdating.value = false
}
async function generateDetails() {
  await learningPathStore.generatePathDetail()
}
async function onSubmit() {
  if (isUpdating.value) {
    const data = {
      learning_path_id: question.value.learningPath.value,
      proficiency: question.value.proficiency.value,
      score: question.value.score,
      title: question.value.title
    }
    data.question = question.value.sk
    await certificationStore.updateDescriptiveQuestion(data)
  } else {
    if (!question.value.learningPath) {
      Notify.create({
        message: 'Learning Path is invalid',
        color: 'red',
        position: 'top',
        timeout: 1100
      })
      return
    } else if (!question.value.proficiency) {
      Notify.create({
        message: 'Proficiency is invalid',
        color: 'red',
        position: 'top',
        timeout: 1100
      })
      return
    } else if (!question.value.score) {
      Notify.create({
        message: 'Score is invalid',
        color: 'red',
        position: 'top',
        timeout: 1100
      })
      return
    } else if (!question.value.title) {
      Notify.create({
        message: 'Title is invalid',
        color: 'red',
        position: 'top',
        timeout: 1100
      })
      return
    }
    const data = {
      learning_path_id: question.value.learningPath.value,
      proficiency: question.value.proficiency.value || question.value.proficiency,
      score: question.value.score,
      title: question.value.title
    }
    await certificationStore.createDescriptiveQuestion(data)
  }
  cancelDialogCreate()
}
function onUpdateQuestion(id) {
  dialogCreate.value = true
  isUpdating.value = true
  question.value = { ...descriptiveQuestions.value.find((question) => question.sk === id) }
  question.value.learningPath = learningPathOptions.value.find((learningPath) => learningPath.value === question.value?.learning_path_id)
}
function onDeleteQuestion(id) {
  isDeleting.value = true
  questionToDelete.value = id
}
async function onSubmitDelete() {
  await certificationStore.deleteDescriptiveQuestion({ question: questionToDelete.value }).then(() => (isDeleting.value = false))
}
function loadMore(last_value) {
  const data = {
    last_value,
    reset: false
  }
  certificationStore.listDescriptiveQuestion(data)
}
function handleUploadQuestionsFromJson() {
  isImporting.value = true
  const files = jsonFile.value?.files
  if (files?.length) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      let jsonData
      try {
        jsonData = JSON.parse(ev.target.result)
      } catch (error) {}
      await certificationStore.importQuestions(jsonData, true)
      await certificationStore.listDescriptiveQuestion({})
      isImporting.value = false
      jsonFile.value = null
    }

    reader.readAsText(files[0])
  } else {
    isImporting.value = false
  }
}
</script>
