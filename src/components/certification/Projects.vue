<script setup>
import { useCertificationStore } from 'src/stores'
import { onBeforeMount, ref, shallowRef } from 'vue'
import ProjectModal from './ProjectModal.vue'
import ProjectsTable from './ProjectsTable.vue'

const certificationStore = useCertificationStore()
const model = defineModel({ type: Boolean, required: true })

const isCreateOpen = shallowRef(false)
const jsonFile = ref(null)
const isImporting = shallowRef(false)

onBeforeMount(() => {
  certificationStore.fetchAllProjects({})
})

function handleUploadProjectsFromJson(ev) {
  isImporting.value = true
  const files = jsonFile.value?.files
  if (files?.length) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      let jsonData
      try {
        jsonData = JSON.parse(ev.target.result)
      } catch (error) {}
      await certificationStore.importProjects(jsonData)
      await certificationStore.fetchAllProjects({})
      isImporting.value = false
      jsonFile.value.value = ''
    }

    reader.readAsText(files[0])
  } else {
    isImporting.value = false
  }
}
</script>

<template>
  <q-dialog v-model="model" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="width: 1000px; max-width: 80vw" dark>
      <q-card-section>
        <q-bar class="bg-transparent text-subtitle1 text-weight-normal">
          Projects
          <q-space />
          <q-btn flat icon="close" round @click="model = false" />
        </q-bar>
        <q-separator dark />
      </q-card-section>

      <q-card-section>
        <div class="row items-center q-gutter-md">
          <q-btn class="block q-mb-md" color="primary" label="Create" @click="isCreateOpen = true" />
          <q-btn
            class="block q-mb-md"
            color="primary"
            :label="isImporting ? 'Importing...' : 'Import json'"
            :disable="isImporting"
            @click="jsonFile?.click()"
          />

          <input v-show="false" type="file" ref="jsonFile" @change="handleUploadProjectsFromJson" accept="application/json" />
        </div>
        <ProjectsTable />
      </q-card-section>
    </q-card>
  </q-dialog>

  <ProjectModal v-if="isCreateOpen" v-model="isCreateOpen" />
</template>
