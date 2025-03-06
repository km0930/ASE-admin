<template>
  <Page isTable title="Challenge" v-model:search="filter" @createPage="createPage" @clearSearchData="clearData">
    <div class="q-pa-md">
      <q-table
        class="q-table th.sortable sticky-header-table"
        :columns="columns"
        dark
        hide-bottom
        row-key="index"
        :rows="listAiChallenges"
        :rows-per-page-options="[0]"
        style="max-height: 70vh"
        virtual-scroll
        :filter="filter"
        :loading="loading"
        v-model:pagination="pagination"
        @virtual-scroll="onScroll"
      >
        <template v-slot:header="props">
          <q-tr :props="props" class="bg-dark">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">
              {{ col.label }}
            </q-th>
            <q-th />
          </q-tr>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td auto-width>
              <q-btn
                size="sm"
                color="black"
                round
                dense
                @click="toggleRow(props.row)"
                :icon="isRowExpanded(props.row) ? 'remove' : 'add'"
              />
            </q-td>
            <q-td v-for="col in props.cols" class="text-capitalize" :key="col.name" :props="props">
              {{ col.value }}
            </q-td>
            <q-td auto-width>
              <q-btn v-if="!props.row.company" color="negative" flat icon="delete" round size="sm" @click="deletePage(props.row._key)">
                <q-tooltip>Delete</q-tooltip>
              </q-btn>
            </q-td>
          </q-tr>
          <q-tr v-show="isRowExpanded(props.row)" :props="props">
            <q-td colspan="100%">
              <div class="flex">
                <span class="text-subtitle2 q-mb-none">Instructions:</span>
                <p class="q-px-xs" style="padding-top: 2px">Identify the vulnerability in this source code.</p>
              </div>
              {{ props.row.language }}
              <highlightjs :language="props.row.language" :code="urlSafeBase64Decode(props.row.code)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="dialog">
      <q-card dark>
        <q-card-section class="text-h6">Are you sure you want to delete this challenge?</q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="white" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </Page>
</template>

<script setup>
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { useAiChallengesStore } from 'app/src/stores'
import 'highlight.js/lib/common'
import 'highlight.js/styles/stackoverflow-dark.css'
import Page from 'src/components/shared/Page'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { computed, onMounted, ref } from 'vue'

const emit = defineEmits(['createPage'])
const aiChallenge = useAiChallengesStore()
const listAiChallenges = computed(() => aiChallenge.listAiChallenges)
const filter = ref('')
const highlightjs = hljsVuePlugin.component
const columns = [
  { name: 'name', required: true, label: 'Name', align: 'left', field: 'name', sortable: true },
  { name: 'language', align: 'center', label: 'Language', field: 'language', sortable: true },
  { name: 'framework', align: 'center', label: 'Framework', field: (row) => row.framework || '-', sortable: true },
  { name: 'difficulty', align: 'center', label: 'Difficulty', field: 'difficulty', sortable: true }
]
const dialog = ref(false)
const challengeToDelete = ref(null)
const expandedRows = ref([])
const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1
})
const loading = ref(false)

onMounted(() => {
  aiChallenge.fetchAiChallenges({ page: pagination.value.page, reset: true })
})

function clearData() {
  filter.value = ''
}

function createPage(event) {
  if (event.show) {
    emit('createPage', { show: true })
  }
}

async function deletePage(id) {
  challengeToDelete.value = id
  dialog.value = true
}

async function confirmDelete() {
  const payload = {
    challenge: challengeToDelete.value
  }

  await aiChallenge.deleteAiChallenges(payload)
  await aiChallenge.fetchAiChallenges({ page: pagination.value.page })
  dialog.value = false
}

function toggleRow(row) {
  if (isRowExpanded(row)) {
    expandedRows.value = expandedRows.value.filter((rows) => rows !== row)
  } else {
    expandedRows.value = [row]
  }
}

function isRowExpanded(row) {
  return expandedRows.value.includes(row)
}

async function onScroll({ to, ref }) {
  const lastIndex = listAiChallenges.value.length - 1

  if (loading.value !== true && aiChallenge.pageInfo.next === true && to === lastIndex) {
    loading.value = true
    pagination.value.page++
    await aiChallenge.fetchAiChallenges({ page: pagination.value.page, reset: false })
    loading.value = false
  }
}
</script>
