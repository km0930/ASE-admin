<template>
  <div>
    <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-up" @escape-key="confirmDeleteCancel()">
      <q-card style="width: 600px; max-width: 80vw" dark>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-subtitle1 ase-roboto text-weight-normal">Confirm</div>
          <q-space />
          <q-btn icon="close" flat round color="white" @click="confirmDeleteCancel()" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="text-h6 text-center">Are you sure you want to {{ header }}?</div>
        </q-card-section>
        <br />
        <q-separator />
        <q-card-actions align="right" class="text-primary">
          <q-btn
            label="No"
            push
            type="submit"
            size="14px"
            color="primary"
            style="width: 80px"
            class="float-left"
            @click="confirmDeleteCancel()"
          />
          <q-btn
            label="Yes"
            push
            type="submit"
            size="14px"
            color="primary"
            style="width: 80px"
            class="float-left"
            @click="confirmDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['show', 'name', 'header'])
const emit = defineEmits(['confirmDelete', 'confirmDeleteCancel'])

const dataShow = ref(props.show)

function confirmDelete() {
  emit('confirmDelete', { show: true })
}
function confirmDeleteCancel() {
  emit('confirmDeleteCancel', { show: true })
}
</script>
