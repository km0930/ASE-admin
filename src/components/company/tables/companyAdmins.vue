<template>
  <div>
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-6" style="padding: 1%"></div>
    </div>
    <div class="row">
      <div class="q-pa-md bg-primary full-width text-white">
        <q-list dark bordered separator>
          <q-item>
            <q-item-section avatar class="white text-subtitle2 ase-roboto">#</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Name</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">Email</q-item-section>
          </q-item>
          <q-item clickable v-ripple v-for="(info, index) of data" :key="'companyUSERR' + info.name + '' + index + info.email">
            <q-item-section avatar class="white text-subtitle2 ase-roboto">{{ index + 1 }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.name }}</q-item-section>
            <q-item-section class="white text-subtitle2 ase-roboto">{{ info.email }}</q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="text-center" style="padding-top: 2%; padding-bottom: 2%" v-if="data.length === 0">
          <p class="text-h4 text-weight-bold ase-roboto ase-black-light padding_12 text-center">No data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CompanyCoursesTable',
  components: {},
  props: {
    data: {}
  }
}
</script>
