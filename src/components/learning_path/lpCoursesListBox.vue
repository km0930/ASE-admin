<template>
  <q-card class="bordered_info bg-primary cursor_pointer">
    <div style="width: 100%; background: #fff" v-if="props.data.logo" @click="moveToCourseInfo(props.data)">
      <q-img
        v-if="props.data.logo"
        :src="props.data.logo"
        :ratio="16 / 9"
        @mouseover="showIcon = false"
        contain
        @mouseleave="showIcon = true"
        :img-style="{ margin: '-3px', 'border-radius': '22px 22px 0px 0px' }"
      >
        <div
          class="absolute-full text-subtitle2 flex flex-center my-text padding_7"
          style="cursor: pointer; background: transparent"
          v-if="showIcon"
        >
          <template></template>
        </div>
      </q-img>
    </div>
    <div
      class="padding_percentage"
      style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%)"
      @click="moveToCourseInfo(props.data)"
    >
      <div class="row">
        <div class="col-md-12 col-sm-12 col-xs-12" style="min-height: 75px">
          <p class="text-subtitle2 text-weight-bold ase-roboto" style="line-height: 1.2">
            {{ props.data.event_name?.length > 45 ? props.data.event_name.substring(0, 45) + ' ... ' : props.data.event_name }}
            <q-tooltip class="text-caption text-weight-thin ase-roboto">{{ props.data.event_name }}</q-tooltip>
          </p>
          <q-item-label caption class="white text-white">
            <template v-if="props.data.isEvent">
              <q-chip outline size="sm" color="orange" text-color="white">
                {{ props.itemType }}
              </q-chip>
            </template>
            <template v-else>
              <q-chip outline size="sm" color="orange" text-color="white">
                {{ props.itemType }}
              </q-chip>
            </template>
          </q-item-label>
        </div>
      </div>
    </div>
  </q-card>
</template>
<script setup>
import { defineEmits, ref } from 'vue'

const props = defineProps(['data', 'itemType'])
const showIcon = ref(true)
const emit = defineEmits(['moveToCourseInfo'])

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}
</script>

<style scoped>
.bordered_info {
  height: 100%;
  width: 100%;
  border-radius: 12px;
}
.padding_percentage {
  padding: 2%;
  border-radius: 12px;
  border-radius: 0px, 4px rgba(0, 0, 0, 0.25);
}
.blur_data_light_mode {
  filter: saturate(25%) !important;
}
.light_data_light_mode {
  filter: saturate(100%) !important;
  color: #fff !important;
}
</style>
