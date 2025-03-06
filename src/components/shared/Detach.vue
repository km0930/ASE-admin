<template>
  <div>
    <q-dialog v-model="dataShow" persistent>
      <q-card style="min-width: 450px" dark>
        <q-card-section>
          <div class="text-subtitle1 ase-roboto text-weight-normal">Are you sure you want to detach {{ header }} ?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            label-color="white"
            outlined
            dark
            dense
            autofocus
            placeholder="Type  DETACH"
            @keyup.enter="prompt = false"
            v-model="typeDetach"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn color="primary" label="Cancel" @click="confirmDeleteCancel()" />
          <q-btn color="primary" label="Yes" @click="confirmDelete()" v-if="typeDetach === 'DETACH'" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'DetachVue',
  props: ['show', 'header'],
  data() {
    return {
      dataShow: this.show,
      typeDetach: ''
    }
  },
  methods: {
    confirmDelete() {
      this.$emit('confirmDetach', { show: true })
    },
    confirmDeleteCancel() {
      this.$emit('confirmDetachCancel', { show: true })
    }
  }
}
</script>
