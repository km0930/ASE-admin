<template>
  <div>
    <q-select
      ref="CloseWindowLabOptions"
      label-color="white"
      outlined
      map-options
      dark
      dense
      :clearable="true"
      :value="selected"
      use-input
      :label="title"
      hide-selected
      fill-input
      input-debounce="0"
      :hide-dropdown-icon="defaultFalse"
      @popup-hide="hidePopUp()"
      :disable="loadingData"
      :autofocus="autofocus"
      :loading="loadingData"
      v-model="searchDataVal"
      @input="$emit('update:selected', $event)"
      @filter="filterFn"
      :rules="required ? [(val) => !!val || 'Field is required'] : []"
      :option-disable="(item) => (item.value ? optionsListData(item.value) : true)"
      :options="optionsList"
    >
      <template v-slot:append>
        <q-icon v-if="selected !== ''" name="refresh" @click="resetClear" class="cursor-pointer" />
        <q-icon v-if="searchInfoLabel" name="search" class="cursor_pointer" @click="searchFilter" />
      </template>
      <template v-slot:after-options v-if="showMore">
        <q-item>
          <q-item-section @click="loadMoreItems" class="text-white" style="cursor: pointer">
            <label v-if="loadingData">...</label>
            <label v-else>
              <q-btn color="primary" size="sm" :label="`Load more`" />
            </label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-red" style="cursor: pointer">No data</q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script>
export default {
  name: 'SingleSelectLabCmp',
  props: {
    selected: {
      required: false
    },
    title: {
      required: false,
      type: String,
      default: 'Name'
    },
    autofocus: {
      required: false,
      type: Boolean,
      default: false
    },
    disabledList: {
      required: true,
      type: Array
    },
    options: {
      required: true,
      type: Array
    },
    showMore: {
      type: Boolean,
      default: false
    },
    loadingData: {
      type: Boolean,
      default: false
    },
    required: {
      required: false,
      type: Boolean,
      default: false
    },
    searchFieldData: {
      required: false,
      type: String
    },
    clearFun: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  watch: {
    searchFieldData: {
      handler(value) {
        if (value) {
          this.searchDataVal = this.searchFieldData
        }
      }
    },
    clearFun: {
      handler(value) {}
    }
  },
  data() {
    return {
      selectOption: null,
      optionsList: [],
      text_loading: 'Load more',
      filterFalse: true,
      searchInfoLabel: '',
      defaultFalse: false,
      searchDataVal: ''
    }
  },
  updated() {
    this.optionsList = this.options
  },
  methods: {
    resetClear() {
      this.optionsList = this.options
      this.searchDataVal = ''
      this.defaultFalse = true
      this.$emit('resetData', { reset: true })
    },
    searchFilter(event) {
      this.filterFalse = true
      this.$emit('searchFilter', { data: this.searchInfoLabel })
    },
    clearFunInfo(event) {
      this.resetClear()
    },
    filterFn(val, update, abort) {
      this.searchInfoLabel = val
      this.filterFalse = false
      if (!val) {
        this.$emit('resetData')
        this.optionsList = this.options
      }
      if (this.optionsList !== null) {
        update()
        return
      }

      setTimeout(() => {
        update(() => {
          this.$emit('findOptions', { show: true })
          this.optionsList = this.options
        })
      }, 1000)
    },
    optionsListData(value) {
      if (this.disabledList.indexOf(value) !== -1) {
        return true
      } else {
        return false
      }
    },
    async loadMoreItems() {
      this.defaultFalse = true
      this.filterFalse = true
      await this.$emit('loadMoreItems')
    },
    hidePopUp(event) {},
    abortFilterFn() {}
  }
}
</script>
