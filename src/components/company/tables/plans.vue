<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-6" style="padding: 1%"></div>
    </div>
    <div class="row">
      <div class="col-12" v-for="(data, index) in cousesList" :key="index">
        <div class="text-subtitle2" style="padding: 12px">
          {{ data }}
        </div>
      </div>
      <div class="col-12">
        <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="cousesList.length === 0">
          <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const props = defineProps({
  companyInfo: {}
})
const cousesList = ref(props.companyInfo)
</script>
