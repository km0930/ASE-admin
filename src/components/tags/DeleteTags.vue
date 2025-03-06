<template>
  <q-card style="width: 400px; max-width: 90vw" dark>
    <q-card-section class="q-pb-md q-pt-lg">
      <q-card-section class="q-pt-none">
        <div class="text-subtitle1">Are you want to delete this tag ?</div>
      </q-card-section>
      <div class="full-width flex q-px-md justify-end">
        <q-btn class="q-mr-sm" color="orange" outline @click="emit('cancel')">no</q-btn>
        <q-btn color="positive" @click="emit('confirm')">yes</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
<script setup>
const emit = defineEmits(['confirm', 'cancel'])
</script>
<style></style>
