<template>
  <q-select
    label-color="white"
    outlined
    dark
    dense
    clearable
    use-input
    hide-selected
    fill-input
    input-debounce="0"
    :options="selectOption"
    options-selected-class="text-orange"
    :value="selected"
    :autofocus="autofocus"
    :disable="disabled"
    :rules="required ? [(val) => !!val || 'Field is required'] : []"
    :label="title"
    @input="$emit('update:selected', $event)"
    @filter="filterFn"
    @virtual-scroll="$emit('virtual-scroll', $event)"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">No data</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
export default {
  name: 'SingleSelect',
  props: {
    options: { required: true, type: Array },
    selected: { required: false },
    autofocus: { required: false, type: Boolean, default: false },
    disabled: { required: false, type: Boolean, default: false },
    required: { required: false, type: Boolean, default: false },
    title: { required: false, type: String, default: 'Name' }
  },
  data() {
    return {
      selectOption: this.options
    }
  },
  methods: {
    filterFn(val, update, abort) {
      if (val) {
        const needle = val.toLowerCase()
        this.selectOption = this.options.filter((v) => v.label.toLowerCase().indexOf(needle) > -1)
      }
      if (val === '' || val === null) {
        this.selectOption = this.options
      }
      if (this.selectOption !== null) {
        update()
        return
      }
      setTimeout(() => {
        update(() => {
          this.$emit('findOptions', { show: true })
          this.selectOption = this.options
        })
      }, 1000)
    }
  }
}
</script>
