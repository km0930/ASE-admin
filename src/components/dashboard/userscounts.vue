<template>
  <div class="boarderedClass">
    <q-card dark bordered class="my-card">
      <q-card-section>
        <div class="row">
          <div class="col-3">
            <q-avatar text-color="white" style="font-size: 5rem" :icon="'supervisor_account'" />
          </div>
          <div class="col-8 flex flex-center" align="middle">
            <label class="text-center portal_bold" style="font-size: 1.5rem">Users</label>
          </div>
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-section style="min-height: 30vh; max-height: 30vh; overflow: auto">
        <q-list bordered>
          <q-item clickable v-ripple>
            <q-item-section>Total users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_cognito_users }}
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>Paid users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_paid_users }}
              </q-avatar>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Free users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_free_users }}
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>Monthly Active Users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_monthly_activeusers }}
              </q-avatar>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Yearly Active Users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_yearly_activeUsers }}
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>Monthly Inactive users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_monthly_inactiveusers }}
              </q-avatar>
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section>Yearly Inactive users</q-item-section>
            <q-item-section avatar>
              <q-avatar color="primary" size="sm" text-color="white">
                {{ total_yearly_inactiveUsers }}
              </q-avatar>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
export default {
  name: 'NumericNumCountsUsers',
  components: {},
  data() {
    return {
      msg: null
    }
  },
  props: [
    'total_cognito_users',
    'total_free_users',
    'total_paid_users',
    'total_monthly_activeusers',
    'total_monthly_inactiveusers',
    'total_yearly_activeUsers',
    'total_yearly_inactiveUsers'
  ]
}
</script>
