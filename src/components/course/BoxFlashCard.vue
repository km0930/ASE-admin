<template>
  <div style="background-color: #313132">
    <q-responsive :ratio="16 / 9" class="none-spacing">
      <q-flashcard :no-hover="hover" :style="style">
        <q-flashcard-section class="fit" :active="active">
          <img
            class="bg-dark"
            contain
            :src="props.data.logo"
            style="width: 100%; height: 100%"
            @mouseleave="showIcon = true"
            @mouseover="showIcon = false"
          />
        </q-flashcard-section>
        <q-flashcard-section transition="fade-in" class="fit cursor_pointer" style="background-color: #fff" :active="active">
          <div class="ase-roboto my-text" @click="moveToCourseInfo(props.data)">
            <br />
            {{ props.data.description.length > 135 ? props.data.description.substring(0, 135) + ' ... ' : props.data.description }}
            <br />
            <q-btn color="primary" size="sm" @click="moveToCourseInfo(props.data)" class="ase-roboto block q-mx-auto q-mt-sm">
              View Info
            </q-btn>
          </div>
        </q-flashcard-section>
      </q-flashcard>
    </q-responsive>
    <div class="row text-subtitle2 q-pt-sm padding_12">
      <div class="col-md-12 col-sm-12 col-xs-12">
        {{ props.data.name.length > 30 ? props.data.name.substring(0, 30) + ' ... ' : props.data.name }}
        <q-tooltip>{{ props.data.name }}</q-tooltip>
      </div>
      <div class="col-md-6 col-sm-6 col-xs-6">
        <template v-if="props.data.isEvent">
          <q-chip size="xs">
            {{ props.itemType }}
          </q-chip>
        </template>
        <template v-else>
          <q-chip size="xs">
            {{ props.itemType }}
          </q-chip>
        </template>
      </div>
      <div class="col-md-6 col-sm-6 col-xs-6">
        <q-btn
          class="float-right"
          label="Publish now"
          size="sm"
          style="display: inline-block"
          text-color="white"
          @click="$emit('attachPlans')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
const props = defineProps(['data', 'itemType'])

const showIcon = ref(true)
const hover = ref(false)
const active = ref(false)
const emit = defineEmits(['moveToCourseInfo'])

const style = computed(() => ({
  width: '100%',
  height: '180px',
  backgroundImage: `url(${props.data.logo})`,
  padding: '1px',
  border: '1px solid #313132',
  textAlign: 'center',
  boxShadow: '1px 1px 2px #313132'
}))

function moveToCourseInfo(data) {
  emit('moveToCourseInfo', { info: data })
}
</script>

<style lang="sass" scoped>
.my-text
  color: black
  font-size: 12px
  line-height: normal
  padding: 8px 16px
</style>
