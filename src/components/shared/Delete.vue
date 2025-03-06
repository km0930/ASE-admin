<template>
  <q-dialog v-model="dataShow" persistent>
    <q-card style="min-width: 450px" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">Are you sure you want to delete {{ header }}?</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          bottom-slots
          color="white"
          dark
          dense
          hint="Write in capital letters"
          label-color="white"
          lazy-rules
          outlined
          placeholder="Type DELETE"
          ref="input"
          :rules="[(val) => val === 'DELETE' || 'Please type DELETE']"
          v-model="typeDelete"
          @blur="!typeDelete ? $refs.input.resetValidation() : $refs.input.validate()"
          @focus="$refs.input.resetValidation()"
        />
      </q-card-section>

      <q-card-actions class="float-right text-primary">
        <q-btn color="primary" label="Cancel" @click="confirmDeleteCancel()" />
        <q-btn v-if="typeDelete === 'DELETE'" color="primary" label="Yes" @click="confirmDelete()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['confirmDelete', 'confirmDeleteCancel'])
const props = defineProps(['show', 'name', 'header'])

const dataShow = ref(props.show)
const typeDelete = ref('')
const header = ref(props.header)

function confirmDelete() {
  emit('confirmDelete', { show: true })
}
function confirmDeleteCancel() {
  emit('confirmDeleteCancel', { show: true })
}
</script>
