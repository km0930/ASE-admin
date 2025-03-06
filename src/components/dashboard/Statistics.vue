<template>
  <div class="bordered_info bg-primary" align="middle">
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <p class="text-subtitle2 text-left">
          <q-icon
            :name="iconName"
            :style="{ color: iconColor, 'font-size': iconSize, padding: iconPadding, 'border-radius': '25px', 'margin-right': '4px' }"
          />
          {{ title }}
        </p>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <p class="text-h6 white ase-roboto" style="line-height: 2">
          {{ count }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DashboardStatistics',
  props: {
    subTitle: {
      type: Number,
      default: 10
    },
    count: {
      type: Number
    },
    title: {
      type: String
    },
    fontSizeLabel: {
      required: false,
      default: '13px'
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
      default: '18px'
    },
    iconPadding: {
      default: '2px'
    }
  },
  data() {
    return {}
  },
  created() {},
  watch: {},
  methods: {},
  computed: {}
}
</script>
<style scoped>
.bordered_info {
  border: 1px solid #1c1c1c;
  padding: 14px;
  border-radius: 0px;
  box-shadow: inset 0px, 1px rgba(0, 0, 0, 0.05);
}
</style>
