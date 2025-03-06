<template>
  <div class="q-pa-md bg-primary full-width text-white">
    <q-list dark bordered separator>
      <q-item v-for="(info, index) of data" clickable :key="index" v-ripple>
        <q-item-section class="white text-subtitle2 ase-roboto">{{ info.plan_name }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['data'])
const data = ref(props.data)
</script>
