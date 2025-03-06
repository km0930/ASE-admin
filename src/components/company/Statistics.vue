<template>
  <div class="bordered_info bg-primary full-height" align="middle">
    <div class="row">
      <div class="col-md-12 col-sm-12 none-spacing col-xs-12">
        <div class="text-subtitle2 text-left none-spacing white ase-roboto" style="display: inline">
          <q-icon
            size="sm"
            :name="iconName"
            :style="{ color: iconColor, 'font-size': iconSize, padding: iconPadding, 'border-radius': '25px', 'margin-right': '4px' }"
          />
          <label style="display: inline-block; line-height: 1.2; margin: 0px; padding-left: 7px">
            {{ title }}
            <q-icon
              v-if="editIcon"
              class="cursor-pointer"
              :name="editIconName"
              align="right"
              @click="$emit('editUsers')"
              :style="{ color: iconColor, 'font-size': iconSize, padding: iconPadding, 'border-radius': '25px', 'margin-right': '4px' }"
            />
          </label>
        </div>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12 ellipsis">
        <p lass="text-h6 white ase-roboto" style="line-height: 2" v-if="updateDomainInfo">
          <q-chip v-for="d in props.count" :key="'domainTitle' + d">{{ d }}</q-chip>
          <q-tooltip v-if="showToolTip">{{ count.toString() }}</q-tooltip>
        </p>
        <p v-else class="text-h6 white none-spacing ase-roboto">
          {{ count }}
          <q-tooltip v-if="showToolTip">{{ count }}</q-tooltip>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  subTitle: {
    default: 10
  },
  count: {},
  title: {
    type: String
  },
  fontSizeLabel: {
    required: false,
    default: '13px'
  },
  showToolTip: {
    required: false,
    default: false
  },
  fontSizeValue: {
    required: false,
    default: '22px'
  },
  iconName: {},
  iconColor: {
    default: '#00000'
  },
  iconSize: {
    default: '16px'
  },
  iconPadding: {
    default: '5px'
  },
  editIcon: {
    default: false
  },
  editIconName: {
    default: 'edit'
  },
  updateDomainInfo: {
    required: false,
    default: false
  }
})
</script>

<style scoped>
.bordered_info {
  border: 1px solid #1c1c1c;
  padding: 14px;
  border-radius: 0px;
  box-shadow: inset 0px, 1px rgba(0, 0, 0, 0.05);
}
</style>
