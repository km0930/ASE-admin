<template>
  <q-card class="text-white padding_7" dark>
    <q-card-section>
      <div class="portal_font_family portal_xxlg portal_font_color">
        {{ title }}
      </div>
    </q-card-section>
    <q-separator dark />
    <q-card-section class="q-mt-md" v-if="isTable">
      <div class="row none_spacing">
        <div class="col none_spacing">
          <q-btn round color="primary" v-if="isCreateIcon" icon="add" @click="createPage()" />
          <div class="col none_spacing" v-else>
            <div class="portal_font_family portal_lg portal_font_color text-left portal_bold">
              {{ props.title }}
            </div>
          </div>
        </div>
        <div class="col none_spacing">
          <q-input
            label-color="white"
            outlined
            dark
            dense
            bottom-slots
            :value="search"
            input-class="text-right"
            class="q-ml-md float-right"
            @keydown.enter.prevent="searchData"
            @input="$emit('update:search', $event)"
          >
            <template v-slot:append>
              <q-icon v-if="search.length > 0" name="clear" class="cursor-pointer" @click="clearSearchData" />
              <q-btn round dense flat icon="search" @click="searchData" />
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pa-none q-mt-md">
      <slot></slot>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Header'
  },
  search: {
    type: String
  },
  isTable: {
    type: Boolean,
    default: false
  },
  isCreateIcon: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['createPage', 'searchData', 'clearSearchData'])

function createPage() {
  emit('createPage', { show: true })
}
function searchData() {
  emit('searchData')
}
function clearSearchData() {
  emit('clearSearchData')
}
</script>
