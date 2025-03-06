<template>
  <q-dialog v-model="show" persistent>
    <q-card style="width: 800px; max-width: 90vw" dark flat>
      <q-card-section>
        <div class="flex justify-between">
          <div class="flex">
            <q-icon class="q-ma-xs" name="create" />
            <p class="text-subtitle1 ase-roboto text-weight-normal q-mb-none">Create Custom Challenge</p>
          </div>
          <q-btn icon="close" flat round dense @click="closeDialog" />
        </div>
        <hr />
      </q-card-section>

      <q-card-section>
        <q-stepper active-color="white" alternative-labels animated dark done-color="positive" ref="stepper" v-model="step">
          <q-step :name="1" title="Create Challenge" icon="article" :done="step > 1">
            <q-form @submit="submit">
              <q-card style="border-radius: 6px !important" dark flat>
                <q-card-section>
                  <p class="text-subtitle1 q-mb-sm">Programming Language *</p>
                  <BaseSelect label="Choose a Language" :options="languages" v-model="language" required />
                  <div class="flex row justify-between">
                    <div class="col-6 q-pr-sm">
                      <p class="text-subtitle1 q-mb-sm">Enter a Framework *</p>
                      <BaseInput label="Enter a Framework" v-model="framework" required />
                    </div>

                    <div class="col-6">
                      <p class="text-subtitle1 q-mb-sm">Vulnerability *</p>
                      <BaseSelect label="Select a Vulnerability" :options="vulnerabilityOptions" v-model="vulnerability" required />
                    </div>
                  </div>
                  <div class="flex row justify-between">
                    <div class="col-6 q-pr-sm">
                      <p class="text-subtitle1 q-mb-sm">Difficulty Level *</p>
                      <BaseSelect
                        :bottom-slots="false"
                        :options="difficultyOptions"
                        label="Choose a Difficulty Level"
                        v-model="difficulty"
                        required
                      />
                    </div>
                    <div class="col-6">
                      <p class="text-subtitle1 q-mb-sm">Validation Type *</p>
                      <BaseSelect
                        :bottom-slots="false"
                        :options="validationTypeOptions"
                        label="Choose a Validation Type"
                        v-model="validationType"
                        required
                      />
                    </div>
                  </div>

                  <p class="text-subtitle1 q-mt-md q-mb-sm">Add additional context</p>
                  <BaseInput v-model="metadata" filled label="Aditional Context" type="textarea" style="border-radius: 6px" />
                </q-card-section>
              </q-card>
              <div class="flex justify-center">
                <q-btn class="q-pa-md text-center" type="submit" color="red" style="width: 690px" :loading="aiChallenge.isLoading">
                  <q-icon name="fas fa-wand-magic-sparkles" size="xs" />
                  <span class="q-ml-sm">Show me the Challenge!</span>
                </q-btn>
              </div>
            </q-form>
          </q-step>

          <q-step :name="2" title="Challenge Preview" icon="code" :done="step > 2">
            <p class="text-subtitle1 q-mb-none text-bold">Instructions:</p>
            <p>Identify the vulnerability in this source code.</p>
            <highlightjs :language="aiChallenge.challengeDetails.language" :code="urlSafeBase64Decode(aiChallenge.challengeDetails.code)" />

            <q-form @submit="saveChallenges">
              <div class="q-my-sm">
                <p class="text-subtitle1 q-mb-xs text-bold">Hints:</p>
                <div v-for="(hint, index) in aiChallenge.challengeDetails.hints" :key="index" class="q-my-sm">
                  <q-input :model-value="hint" filled readonly dense dark />
                </div>
              </div>

              <div class="flex justify-center q-py-sm">
                <q-btn
                  class="q-pa-md text-center full-width"
                  type="submit"
                  label="Save Question"
                  color="green"
                  :loading="aiChallenge.isLoading || saveChallengeLoading"
                />
              </div>

              <div class="q-py-xs">
                <q-icon name="fas fa-thin fa-face-frown" color="yellow-8" />
                <span class="q-ml-xs">
                  Not happy?
                  <q-btn flat class="q-ml-sm" color="red" size="12px" @click="regenerate(details)">Regenerate</q-btn>
                </span>
              </div>
            </q-form>
          </q-step>
        </q-stepper>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { useAiChallengesStore } from 'app/src/stores'
import 'highlight.js/lib/common'
import 'highlight.js/styles/stackoverflow-dark.css'
import BaseInput from 'src/components/shared/BaseInput'
import BaseSelect from 'src/components/shared/BaseSelect'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'

const aiChallenge = useAiChallengesStore()
const show = defineModel('show')
const saveChallengeLoading = ref(false)
const highlightjs = hljsVuePlugin.component
const languages = ['Java', 'Python', 'Javascript', 'C#', 'Ruby', 'Go', 'Kubernetes YAML', 'Terraform']
const difficultyOptions = ['Random', 'Basic', 'Intermediate', 'Advanced']
const validationTypeOptions = ['Code', 'Text']
const vulnerabilityOptions = [
  'SQL Injection',
  'Command Injection',
  'File Upload Vulnerability',
  'XML Injection',
  'Server-Side Request Forgery',
  'Insecure Deserialization',
  'Excessive Data Exposure',
  'Insecure Direct Object Reference (Broken AuthZ)',
  'Mass Assignment',
  'Session Fixation'
]
const language = ref('')
const framework = ref('')
const vulnerability = ref('')
const difficulty = ref('')
const metadata = ref('')
const step = ref(1)
const details = ref({})
const validationType = ref('')

const submit = async () => {
  if (difficulty.value === 'Random') {
    const options = difficultyOptions.filter((option) => option !== 'Random')
    difficulty.value = options[Math.floor(Math.random() * options.length)]
  }
  const payload = {
    language: language.value,
    framework: framework.value,
    difficulty: difficulty.value,
    metadata: metadata.value,
    vulnerability: vulnerability.value,
    validation_type: validationType.value
  }

  await aiChallenge.generateAiChallenges(payload).then(() => {
    details.value = aiChallenge.challengeDetails
    step.value = 2
  })
}

const saveChallenges = async () => {
  const payload = {
    code: details.value.code,
    language: details.value.language,
    framework: details.value.framework,
    difficulty: details.value.difficulty,
    hints: details.value.hints,
    metadata: details.value.metadata,
    vulnerability: details.value.vulnerability,
    validation_type: details.value.validation_type
  }

  saveChallengeLoading.value = true
  await aiChallenge.saveAiChallenges(payload)
  show.value = false
  language.value = ''
  framework.value = ''
  vulnerability.value = ''
  difficulty.value = ''
  metadata.value = ''
  validationType.value = ''
  saveChallengeLoading.value = false
  step.value = 1
}

const regenerate = async (details) => {
  const payload = {
    language: language.value,
    framework: framework.value,
    difficulty: difficulty.value,
    metadata: metadata.value,
    vulnerability: vulnerability.value,
    validation_type: validationType.value
  }

  await aiChallenge.generateAiChallenges(payload).then(() => {
    details.value = aiChallenge.challengeDetails
  })
}

const closeDialog = () => {
  show.value = false
  language.value = ''
  framework.value = ''
  vulnerability.value = ''
  difficulty.value = ''
  metadata.value = ''
  validationType.value = ''
  step.value = 1
}
</script>
