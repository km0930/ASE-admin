<template>
  <div class="boarderedClass">
    <q-card dark bordered class="my-card">
      <q-card-section>
        <q-avatar text-color="white" :icon="'list'" />
        Company
      </q-card-section>

      <q-separator dark />

      <q-card-section style="min-height: 10vh; max-height: 30vh; overflow: auto">
        <div class="row">
          <div class="col-3" style="border-left-style: solid; border-color: #0b6fb3">
            <p style="padding-left: 5px">Total</p>
            <span style="padding-left: 5px; font-weight: bold">{{ total_company }}</span>
          </div>
          <div class="col-3" style="border-left-style: solid; border-color: #21ba45">
            <p style="padding-left: 5px">Event</p>
            <span style="padding-left: 5px; font-weight: bold">{{ total_event_company }}</span>
          </div>
          <div class="col-3" style="border-left-style: solid; border-color: #ba5029">
            <p style="padding-left: 5px">POC</p>
            <span style="padding-left: 5px; font-weight: bold">{{ total_poc_company }}</span>
          </div>
          <div class="col-3" style="border-left-style: solid; border-color: #e0be36">
            <p style="padding-left: 5px">Enterprise</p>
            <span style="padding-left: 5px; font-weight: bold">{{ total_teams_pro_company }}</span>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'NumericNumCountsCompany',
  data() {
    return {
      msg: null
    }
  },
  props: ['total_company', 'total_event_company', 'total_teams_pro_company', 'total_poc_company']
}
</script>
