<template>
  <div style="background-color: #313132" class="full-height">
    <q-responsive :ratio="16 / 9">
      <q-flashcard :no-hover="hover" :style="style">
        <q-flashcard-section class="fit" :active="active">
          <img
            :src="data.logo"
            style="width: 100%; height: 100%"
            @mouseover="showIcon = false"
            class="bg-dark"
            contain
            @mouseleave="showIcon = true"
          />
        </q-flashcard-section>
        <q-flashcard-section transition="fade-in" class="fit cursor_pointer" style="top: 0; background-color: #fff" :active="active">
          <div class="ase-roboto my-text" @click="moveToCourseInfo(data)">
            <br />
            {{ data.description?.length > 135 ? data.description.substring(0, 135) + ' ... ' : data.description }}
            <br />
            <q-btn color="primary" size="sm" @click="moveToCourseInfo(data)" class="ase-roboto q-mt-sm">View Info</q-btn>
          </div>
        </q-flashcard-section>
      </q-flashcard>
    </q-responsive>
    <div class="row text-subtitle2 q-pt-sm padding_12">
      <div class="col-md-12 col-sm-12 col-xs-12">
        {{ data.name?.length > 30 ? data.name.substring(0, 30) + ' ... ' : data.name }}
        <q-tooltip>{{ data.name }}</q-tooltip>
      </div>
      <div class="col-md-8 col-sm-8 col-xs-8">
        <q-chip class="text-capitalize" text-color="dark" size="sm">{{ data.isEvent ? 'Event' : data.event_status }}</q-chip>
        <div v-if="data.rating" class="inline-block">
          <!-- eslint-disable-next-line vue/no-mutating-props -->
          <q-rating v-model="data.rating" icon-half="star_half" max="1" readonly />
          <b class="text-caption">&nbsp;{{ data.rating }} ({{ data.rcount }})</b>
        </div>
        <q-icon v-if="shouldSuccessInjectButton" name="done" color="green" size="xs">
          <q-tooltip style="font-size: 13px">Ingestion succeeded.</q-tooltip>
        </q-icon>
        <q-icon v-if="showInjecting" name="pending" color="yellow" size="xs">
          <q-tooltip style="font-size: 13px">Ingesting now ....</q-tooltip>
        </q-icon>
        <q-icon v-if="shouldFailedInjectButton && !showInjecting" name="clear" color="red" size="xs">
          <q-tooltip style="font-size: 13px">Ingestion failed.</q-tooltip>
        </q-icon>
      </div>
      <div class="col-md-4 col-sm-2 col-xs-2 q-ml-2 flex no-wrap" :style="{ gap: '2px' }">
        <q-btn class="float-right" icon="add" size="sm" text-color="white">
          <q-tooltip>Tags</q-tooltip>
          <q-menu v-model="openTagMenu" style="min-width: 10rem !important" dark>
            <q-list>
              <q-item>
                <q-item-section>
                  <q-form
                    ref="addForm"
                    class="q-pt-sm flex items-start justify-between q-gutter-lg full-width no-wrap"
                    @submit.prevent="updateCourseTags"
                  >
                    <BaseSelect
                      label="Tag name"
                      v-model="tagNames"
                      class="q-ml-none"
                      multiple
                      :options="
                        fetchTagList.map((item) => {
                          return {
                            label: item.tag_name,
                            value: item.tag_name
                          }
                        })
                      "
                    />
                    <q-btn type="submit" unelevated round icon="send" size="md"></q-btn>
                  </q-form>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn class="float-right" icon="more_vert" size="sm" text-color="white">
          <q-menu dark>
            <q-list style="min-width: 100px">
              <q-item clickable v-close-popup @click="$emit('copyCourse')">
                <q-item-section>Clone Course</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('showSortCourse')">
                <q-item-section>Sort Subjects</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('showFeedbackCourse')">
                <q-item-section>Feedbacks</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('showUpdateCourse')">
                <q-item-section>Update</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="$emit('showDeleteCourse')">
                <q-item-section>Delete</q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="exportCourse(data)"
                v-if="originUrl === 'https://uat.admin.appsecengineer.com' || originUrl === 'http://localhost:8081'"
              >
                <q-item-section>Export</q-item-section>
              </q-item>
              <q-item
                v-if="shouldRenderInjectButton"
                :style="{ color: showInjecting ? 'grey' : 'white' }"
                :clickable="shouldRenderClickable"
                v-close-popup
                @click="$emit('injectCourse')"
              >
                <q-item-section>Inject to ASEGPT</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>

      <div class="col-md-12 col-sm-12 col-xs-12">
        <q-chip v-for="(tag, index) in data?.tags || []" :key="index" class="text-capitalize" text-color="dark" size="sm">{{ tag }}</q-chip>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseSelect from 'components/shared/BaseSelect.vue'
import { useCourseStore } from 'src/stores/course'
import { useTagsStore } from 'src/stores/tags'
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps(['data', 'itemType'])
const emit = defineEmits(['moveToCourseInfo'])
const router = useRouter()
const courseStore = useCourseStore()
const tagsStore = useTagsStore()

const showIcon = ref(true)
const hover = ref(false)
const active = ref(false)
const originUrl = ref(window.origin)
const tagNames = ref(props.data?.tags ?? null)
const openTagMenu = ref(false)

const fetchTagList = computed(() => tagsStore.tags)
const ingestionStarted = computed(() => courseStore.ingestionStarted)
const ingestedCourseId = computed(() => courseStore.injectedJobId)
const ingestingCourseId = computed(() => courseStore.injectingJobId)

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}
function exportCourse(data) {
  router.push(`/portal/move-to-prod/${urlSafeBase64Encode(data.id)}`)
}
function updateCourseTags() {
  openTagMenu.value = false
  if (JSON.stringify(props.data?.tags) === JSON.stringify(tagNames.value)) return
  courseStore.updateCourse({ event_id: props.data?.id, tags: tagNames.value })
}

const style = computed(() => ({
  width: '100%',
  height: '180px',
  backgroundImage: `url(${props.data.logo})`,
  padding: '1px',
  border: '1px solid #313132',
  textAlign: 'center',
  boxShadow: '1px 1px 2px #313132'
}))

const shouldRenderClickable = computed(() => {
  return props.data.value.asegpt_ingestion_status !== 'Succeeded' && !ingestionStarted.value
})
const shouldShowInjectedToASEGPT = computed(() => {
  return (id) => {
    const temp = [...Object.values(ingestedCourseId)]
    return ingestedCourseId.value && temp.includes(id)
  }
})
const showInjecting = computed(() => {
  return shouldShowInjectingToASEGPT.value(props.data.id)
})
const shouldFailedInjectButton = computed(() => {
  return (
    props.data.event_status === 'course' &&
    props.data.asegpt_ingestion_status !== 'Succeeded' &&
    !shouldShowInjectedToASEGPT.value(props.data.id)
  )
})
const shouldSuccessInjectButton = computed(() => {
  return (
    props.data.event_status === 'course' &&
    (props.data.asegpt_ingestion_status === 'Succeeded' || shouldShowInjectedToASEGPT.value(props.data.id))
  )
})
const shouldShowInjectingToASEGPT = computed(() => {
  return (id) => {
    const temp = [...Object.values(ingestingCourseId.value)]
    return ingestingCourseId.value && temp.includes(id)
  }
})
const shouldRenderInjectButton = computed(() => {
  return (
    props.data.event_status === 'course' &&
    !shouldShowInjectedToASEGPT.value(props.data.id) &&
    (props.data.asegpt_ingestion_status === null || props.data.asegpt_ingestion_status === 'Failed')
  )
})
</script>

<style lang="sass" scoped>
.my-text
  color: black
  font-size: 12px
  line-height: normal
  padding: 8px 16px
</style>
