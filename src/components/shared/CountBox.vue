<template>
  <div>
    <div style="border: 1px solid grey; width: 100%">
      <span class="info-box-icon portal_xxlg bg-grey-10">
        <q-avatar color="black" text-color="white" :icon="iconType" />
      </span>
      <template v-if="countValue">
        <div style="height: 80px; padding-top: 12px">
          <span class="centering_div portal_lg portal_font_color portal_family portal_bold">{{ name }}</span>
          <span class="centering_div portal_xlg portal_family portal_font_color cursor_pointer" @click="clickAction(name)">
            {{ countValue }}
          </span>
        </div>
      </template>
      <template v-else>
        <div style="height: 80px; padding-top: 12px">
          <span class="centering_div portal_lg portal_font_color portal_family portal_bold">{{ name }}</span>
          <span class="centering_div portal_xlg portal_font_color">{{ countValue }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
props = defineProps({
  name: {
    required: false,
    type: String,
    default: ''
  },
  title: {
    required: false,
    type: String,
    default: 'Size'
  },
  countValue: {
    required: false
  },
  iconType: {
    required: false,
    type: String
  }
})
const emit = defineEmits(['actionItem'])

function clickAction(value) {
  emit('actionItem', { type: value })
}
</script>
<style scoped>
.info-box-icon {
  display: block;
  float: left;
  width: 80px;
  text-align: center;
  font-size: 50px;
  min-height: 80px;
  max-height: 80px;
}
</style>
