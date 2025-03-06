<template>
  <div>
    <div>
      <div>
        <q-card dark>
          <br />
          <q-stepper
            active-color="orange"
            animated
            alternative-labels
            class="bg-grey-10"
            done-color="positive"
            dark
            icon="school"
            ref="stepper"
            v-model="moveStep"
          >
            <q-step :name="2" title="Learning paths" caption="" icon="add_road" :done="moveStep > 2">
              <q-card dark class="padding_7">
                <template>
                  <div class="row" v-for="[key, value] in Object.entries(verifyAllDataGetter.lps)" :key="key + 'value' + value.sk">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <div class="text-h6 shadow-5 q-pa-md text-center">{{ key.split('#')[1] }}</div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="q-ma-sm bg-grey-9 full-height">
                        <div class="text-subtitle1 bg-grey-9 shadow-1 q-pa-md text-center">Copy same learning path</div>
                        <q-card class="bg-grey-9 flex flex-center" flat>
                          <q-card-section>
                            <div>
                              <input :value="defaultSelectLps(key)" type="hidden" />
                              <q-btn dark @click="copyCourseLps(key)" :color="Object.keys(selectionLps).length > 0 ? 'primary' : 'green'">
                                {{ Object.keys(selectionLps).length > 0 ? 'Copy' : 'Copied' }}
                              </q-btn>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="q-ma-sm bg-grey-9 full-height">
                        <div class="text-subtitle1 shadow-1 q-pa-md text-center">Production Learning path</div>
                        <div v-for="val in value" :key="val.sk + 'INST_SUB'">
                          <q-card class="bg-grey-9" flat>
                            <q-list flat>
                              <q-item v-if="Object.keys(selectionLps).length > 0 && selectionLps[key].value === val.sk">
                                <q-item-section class="text-subtitle2">
                                  <div class="text-green text-subtitle2" v-if="selectionLps[key].value === val.sk">
                                    Selected Existing prod Learning path
                                  </div>
                                </q-item-section>
                              </q-item>
                              <q-item v-else>
                                <q-checkbox
                                  @input="checkedOrNot(key)"
                                  dark
                                  v-model="selectionLps[key]"
                                  :false-value="''"
                                  :true-value="{ value: val.sk, label: val.learning_path_name }"
                                  :label="val.learning_path_name"
                                />
                              </q-item>
                              <q-item>
                                <q-item-section class="text-subtitle2">Learning path: {{ val.learning_path_name }}</q-item-section>
                              </q-item>
                              <q-item>
                                <q-item-section class="text-subtitle2">Created on: {{ val.created_on }}</q-item-section>
                              </q-item>
                            </q-list>
                          </q-card>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                      <div class="q-ma-sm bg-grey-9 full-height">
                        <div class="text-subtitle1 bg-grey-9 shadow-1 q-pa-md text-center">Selected Learning path and Choose New</div>
                        <q-card class="bg-grey-9 flex flex-center" flat>
                          <q-card-section>
                            <div>
                              <SingleSelect v-model="selectionLps[key]" :options="learningPathOption" :title="'Learning Paths *'" />
                            </div>
                            <div>
                              <p class="q-pt-md">
                                <label v-if="key in selectionLps">
                                  <label class="text-green" v-if="selectionLps[key].label">
                                    Learning path: {{ selectionLps[key].label }}
                                  </label>
                                  <label v-else-if="selectionLps[key]">selected from production</label>
                                </label>
                                <label v-else-if="key in copyLps">Copied</label>
                              </p>
                            </div>
                          </q-card-section>
                        </q-card>
                      </div>
                    </div>
                  </div>
                </template>
              </q-card>
            </q-step>

            <q-step :name="3" title="Labs" icon="science">
              <q-card dark class="padding_7">
                <template>
                  <div
                    class="row padding_7"
                    v-for="[key, value] in Object.entries(verifyAllDataGetter.labs)"
                    :key="key + 'value' + value.sk"
                  >
                    <div class="col-lg-3 col-md-3 col-sm-3 col-xs-3 vt_center">
                      <div class="text-h6 padding_7">{{ key.split('#')[1] }}</div>
                    </div>
                    <div class="col-lg-9 col-md-9 col-sm-9 col-xs-9">
                      <div class="row">
                        <template>
                          <div
                            class="col-lg-6 col-md-6 col-sm-6 col-xs-6 bordered_class padding_7"
                            v-for="val in value"
                            :key="val.sk + 'LAB_SUB'"
                          >
                            <div>
                              <q-card
                                dark
                                v-bind:class="{ bordered_class_active: typeof selectionLab[key] === 'string' && selectionLab[key] }"
                              >
                                <q-list dark>
                                  <q-item>
                                    <input :value="defaultCheckbox(key, val.sk)" type="hidden" />
                                    <q-checkbox
                                      style="bordered: 1px solid #fff"
                                      @input="checkedOrNot(key)"
                                      dark
                                      v-model="selectionLab[key]"
                                      :value="selectionLab[key]"
                                      :false-value="''"
                                      :true-value="val.sk"
                                      :label="val.lab_name"
                                    />
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Lab TTL: {{ val.lab_ttl }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Regions: {{ val.regions.toString() }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Configuration: {{ val.configuration }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Image id: {{ val.image_id }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>SK: {{ val.sk }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Approx time: {{ val.approx_time }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Documentation: {{ val.documentation_filename }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Description: {{ val.description }}</q-item-section>
                                  </q-item>
                                  <q-item>
                                    <q-item-section>Created on: {{ val.created_on }}</q-item-section>
                                  </q-item>
                                </q-list>
                              </q-card>
                            </div>
                          </div>
                        </template>
                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 bordered_class padding_7">
                          <br />
                          <input :value="defaultSelect(key)" type="hidden" />
                          <q-btn dark v-if="key in selectionLab ? selectionLab[key].label : false" @click="copyCourse(key)" outline>
                            Copy Existing
                          </q-btn>
                          <q-btn dark v-else @click="copyCourse(key)" :color="'green'" outline>Copied same lab</q-btn>
                          <br />
                          <br />
                          <br />
                          <SingleSelectLabFields
                            :disabled="false"
                            :searchFieldData="searchLabData"
                            :clearFun="clearTg"
                            v-model:selected="selectionLab[key]"
                            :title="'Select Existing Labs'"
                            :showMore="showMoreGetterLabs"
                            @loadMoreItems="loadMoreItemsLabs"
                            :loadingData="showMoreLoadingGetterLabs"
                            :disabledList="disabledLabsIds"
                            @resetData="resetDataLabsOptions"
                            @searchFilter="searchFilter"
                            :options="fetchListLabsOptions"
                          />
                          <div>
                            <br />
                            <br />
                            <p class="padding_7 portal_lg">
                              <label v-if="key in selectionLab">
                                <label v-if="selectionLab[key].label" class="portal_bold text-green">Selected from: Dropdown</label>
                                <label v-else-if="selectionLab[key]" class="portal_bold text-green">Selected from: checkBox</label>
                              </label>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </q-card>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <div class="text-right" align="right">
                  <div v-if="moveStep === 1 && verifyAllDataGetter.events.length > 0">
                    <q-btn class="text-capitalize bg-primary text-white" @click="goBackToCourses()">Previous</q-btn>
                    <q-btn class="text-capitalize bg-primary text-white" @click="nextStep()">Next</q-btn>
                  </div>
                  <div v-if="moveStep === 2">
                    <q-btn class="text-capitalize bg-primary text-white q-mr-sm" @click="goBackToCourses()">Courses</q-btn>
                    <q-btn
                      class="text-capitalize bg-primary text-white"
                      v-if="verifyAllDataGetter.events.length > 0"
                      @click="goBackToCourses()"
                    >
                      Previous
                    </q-btn>
                    <q-btn class="text-capitalize bg-primary text-white" @click="nextStep()">Next</q-btn>
                  </div>
                  <div v-if="moveStep === 3">
                    <q-btn class="text-capitalize bg-primary text-white q-mr-sm" @click="goBackToCourses()">Courses</q-btn>
                    <q-btn class="text-capitalize bg-primary text-white q-mr-sm" @click="goBackToCourses()">Previous</q-btn>
                    <q-btn class="text-capitalize bg-primary text-white q-mr-sm" @click="submitCourseDataToProd()">Submit</q-btn>
                  </div>
                </div>
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import SingleSelect from 'components/shared/SingleSelect'
import SingleSelectLabFields from 'components/shared/SingleSelectLabFields'
import { useCourseStore, useLabsStore, useLearningPathStore } from 'src/stores'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const clearTg = ref(false)
const moveStep = ref(1)
const copyLabs = ref({})
const tempSelectLab = ref({})
const copyLps = ref({})
const selectionLab = ref({})
const selectionLps = ref({})
const stepper = ref(null)
// const learningPathsSelect = ref(null)
const labs_data_select = ref(null)
const searchLabData = ref('')
const courseStore = useCourseStore()
const learningPathStore = useLearningPathStore()
const labsStore = useLabsStore()
const route = useRoute()

const verifyAllDataGetter = computed(() => courseStore.verifyAllData)
const learningPathOption = computed(() => (learningPathStore.learningPathOptions.length > 0 ? [...new Set(learningPathStore.learningPathOptions)] : []))
const showMoreGetterLabs = computed(() => labsStore.showMore)
const labPaginationKeyForwardLabs = computed(() => labsStore.paginationKey)
const fetchListLabsOptions = computed(() => (labsStore.listLabsOptions.length > 0 ? [...new Set(labsStore.listLabsOptions)] : []))
const showMoreLoadingGetterLabs = computed(() => labsStore.showMoreLoading)
const fetchLoadMoreTypeLabGetter = computed(() => labsStore.loadMoreTypeLab)
const disabledLabsIds = computed(() => {
  return Object.entries(selectionLab.value).map(([key, value]) => {
    return typeof value === 'object' ? value.value : value
  })
})
const selectedGetter = computed(() => {
  return Object.entries(verifyAllDataGetter.value.labs).reduce((acc, [key, value]) => {
    acc[key] = value[0].sk
    return acc
  }, {})
})

onMounted(async () => {
  const dataVerify = {
    event_id: urlSafeBase64Decode(route.params.courseId)
  }
  await courseStore.moveCourseToProdVerify(dataVerify)
  await labsStore.resetToLab('lab')
  const data = {
    pagination: {},
    reset: true
  }
  await labsStore.fetchLabs(data)
  if (learningPathOption.value.length === 0) {
    learningPathStore.fetchLearningPathOptions()
  }
  if (verifyAllDataGetter.value.events.length === 0) {
    nextStep()
  }
  selectionLab.value = selectedGetter.value
})

async function defaultSelect(key) {
  copyLabs.value[key] = key
}
function defaultCheckbox(key, value) {
  tempSelectLab.value[key] = value
}
async function defaultSelectLps(key) {
  copyLps.value[key] = key
}
async function submitCourseDataToProd() {
  const labJson = {}
  Object.entries(selectionLab.value).forEach(([key, value]) => {
    const keyId = key.split('#')
    if (typeof value === 'object') {
      if (value.value) {
        labJson[keyId[0]] = value.value
      }
    } else {
      if (value) {
        labJson[keyId[0]] = value
      }
    }
  })
  Object.entries(copyLabs.value).forEach(([key, value]) => {
    const keyId = key.split('#')
    if (!(keyId[0] in labJson)) {
      labJson[keyId[0]] = 'COPY'
    }
  })

  const lpsJson = {}
  Object.entries(selectionLps.value).forEach(([key, value]) => {
    const keyId = key.split('#')
    if (typeof value === 'object') {
      if (value.value) {
        lpsJson[keyId[0]] = value.value
      }
    } else {
      if (value) {
        lpsJson[keyId[0]] = value
      }
    }
  })
  Object.entries(copyLps.value).forEach(([key, value]) => {
    const keyId = key.split('#')
    if (!(keyId[0] in lpsJson)) {
      lpsJson[keyId[0]] = 'COPY'
    }
  })
  const data = {
    event_id: urlSafeBase64Decode(route.params.courseId),
    lps: lpsJson,
    labs: labJson
  }
  await courseStore.moveCourseToProdSubmit(data)
}
async function copyCourseLps(key) {
  copyLps.value[key] = key
  selectionLps.value[key] = null
  if (key in selectionLps.value) {
    delete selectionLps.value[key]
  }
}
async function copyCourse(key) {
  copyLabs.value[key] = key
  selectionLab.value[key] = null
  if (key in selectionLab.value) {
    delete selectionLab.value[key]
  }
}
function checkedOrNot(key) {}
async function goBackToCourses() {
  if (moveStep.value === 1) {
    this.$router.push('/portal/courses')
  } else if (moveStep.value === 2) {
    if (learningPathOption.value.length === 0) {
      learningPathStore.fetchLearningPathOptions()
    }
    moveStep.value = moveStep.value - 1
  } else {
    await labsStore.resetToLab('lab')
    const data = {
      pagination: {},
      reset: true
    }
    await labsStore.fetchLabs(data)
    moveStep.value = moveStep.value - 1
  }
}
function nextStep() {
  stepper.value.next()
}
async function resetDataLabsOptions(event) {
  searchLabData.value = ''
  if (event) {
    labs_data_select.value = null
    searchLabData.value = ''
    if (event) {
      if (event.reset && fetchLoadMoreTypeLabGetter.value === 'search') {
        const data = {
          pagination: {},
          reset: true
        }
        await labsStore.fetchLabs(data)
      }
    } else if (event) {
      if (event.reset && fetchLoadMoreTypeLabGetter.value === 'lab') {
        const data = {
          pagination: {},
          reset: true
        }
        await labsStore.fetchLabs(data)
      }
    }
  }
}
async function searchFilter(event) {
  if (event.data) {
    searchLabData.value = event.data
    const data = {
      pagination: {
        pk: 'lab',
        query: event.data
      },
      reset: true
    }
    await labsStore.fetchSearchLabs(data)
  }
}
async function loadMoreItemsLabs(event) {
  if (fetchLoadMoreTypeLabGetter.value === 'lab') {
    const data = {
      pagination: {
        last_value: labPaginationKeyForwardLabs.value
      },
      reset: false
    }
    await labsStore.fetchLabs(data)
  } else if (fetchLoadMoreTypeLabGetter.value === 'search') {
    const dataLab = {
      pagination: {
        pk: 'lab',
        pagination: labPaginationKeyForwardLabs.value,
        query: searchLabData.value
      },
      reset: false
    }
    await labsStore.fetchSearchLabs(dataLab)
  }
}
</script>

<style scoped>
.bordered_class {
  border: 0.5px solid rgb(182, 178, 178);
  border-radius: 0px;
}
.bordered_class_active {
  border: 0.5px solid rgb(182, 178, 178);
  background: #000;
  color: #fff;
}
.vt_center {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
</style>
