<template>
  <div class="boarderedClass">
    <q-card dark bordered class="my-card">
      <q-card-section>
        <q-avatar text-color="white" :icon="'science'" />
        Labs
      </q-card-section>

      <q-separator dark />

      <q-card-section style="min-height: 10vh; max-height: 30vh; overflow: auto">
        <div class="row">
          <div class="col-3" style="border-left-style: solid; border-color: #0b6fb3">
            <p style="padding-left: 5px">Total</p>
            <span style="padding-left: 5px; font-weight: bold">{{ total_labs }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'NumericNumCountsLab',
  data() {
    return {
      msg: null
    }
  },
  props: ['total_labs']
}
</script>
