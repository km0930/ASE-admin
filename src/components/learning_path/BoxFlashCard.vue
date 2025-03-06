<template>
  <div style="background-color: #313132">
    <q-responsive :ratio="1 / 1">
      <q-flashcard :no-hover="hover" :style="style">
        <q-flashcard-section class="fit" :active="active">
          <q-responsive :ratio="1">
            <q-img
              class="bg-dark"
              :src="props.data.logo"
              style="width: 100%; height: 100%"
              @mouseleave="showIcon = true"
              @mouseover="showIcon = false"
            />
          </q-responsive>
        </q-flashcard-section>
        <q-flashcard-section transition="fade-in" class="fit cursor_pointer" style="background-color: #fff" :active="active">
          <div class="ase-roboto my-text text-justify" @click="moveToDetailedInfo(props.data)">
            <br />
            {{ props.data.description?.length > 280 ? props.data.description.substring(0, 280) + ' ... ' : props.data.description }}
            <br />
            <q-btn color="primary" size="sm" @click="moveToDetailedInfo(props.data)" class="ase-roboto block q-mx-auto q-mt-sm">
              View Info
            </q-btn>
          </div>
        </q-flashcard-section>
      </q-flashcard>
    </q-responsive>
    <div class="row text-subtitle2 q-pt-sm padding_12">
      <div class="col-md-12 col-sm-12 col-xs-12" style="padding-left: 7px">
        {{ props.data.name?.length > 30 ? props.data.name.substring(0, 30) + ' ... ' : props.data.name }}
        <q-tooltip>{{ props.data.name }}</q-tooltip>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 padding_7">
        <q-btn round color="white" icon="fas fa-sort" text-color="dark" size="xs" @click="viewSortContents(props.data)">
          <q-tooltip>Sort</q-tooltip>
        </q-btn>
        <q-btn round color="white" class="q-ml-sm" icon="edit" text-color="dark" size="xs" @click="$emit('showUpdateLearningPath')">
          <q-tooltip>Update</q-tooltip>
        </q-btn>
        <q-btn round color="white" class="q-ml-sm" icon="delete" text-color="dark" size="xs" @click="$emit('showDeleteLearningPath')">
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps(['data', 'itemType'])

const router = useRouter()
const showIcon = ref(true)
const hover = ref(false)
const active = ref(false)

const style = computed(() => ({
  width: '100%',
  height: '200px',
  backgroundImage: `url(${props.data.logo})`,
  padding: '7px',
  border: '1px solid #313132',
  textAlign: 'center',
  boxShadow: '1px 1px 2px #313132'
}))

function moveToDetailedInfo(data) {
  router.push(`/portal/learning-path/${urlSafeBase64Encode(data.id)}/${urlSafeBase64Encode(data.name || data.learning_path_name)}/`)
}
function viewSortContents(data) {
  router.push(`/portal/sort/lp/${urlSafeBase64Encode(data.id)}/${urlSafeBase64Encode(data.name || data.learning_path_name)}/`)
}
</script>

<style lang="sass" scoped>
.my-text
  color: black
  font-size: 12px
  line-height: normal
  padding: 8px 16px
</style>
