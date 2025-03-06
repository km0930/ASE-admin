<template>
  <q-card class="q-pa-md" dark flat>
    <q-card-section v-if="isTable">
      <div class="items-center justify-between row">
        <q-btn v-if="isCreateIcon" color="primary" label="Create" @click="createPage()" />
        <q-input
          v-if="showSearch"
          class="q-ml-auto"
          color="white"
          dark
          dense
          input-class="text-right"
          :model-value="search"
          outlined
          style="max-width: 15rem"
          @keydown.enter.prevent="searchData"
          @update:model-value="$emit('update:search', $event)"
        >
          <template v-slot:append>
            <q-icon v-if="search?.length > 0" name="clear" class="cursor-pointer" @click="clearSearchData" />
            <q-btn round dense flat icon="search" @click="searchData" />
          </template>
        </q-input>
      </div>
    </q-card-section>
    <q-card-section>
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script setup>
const emit = defineEmits(['createPage', 'searchData', 'clearSearchData'])
const props = defineProps({
  search: { type: String },
  isTable: { type: Boolean, default: false },
  isCreateIcon: { type: Boolean, default: true },
  showSearch: { type: Boolean, default: true }
})

function createPage() {
  emit('createPage', { show: true })
}

function searchData() {
  emit('searchData', props.search)
}

function clearSearchData() {
  emit('clearSearchData')
}
</script>
