<template>
  <div>
    <PaymentsTable v-if="!isCreate && !isDelete" @createPayment="createPayment($event)" @updatePayment="updatePayment($event)" />
    <CreatePayment v-if="isCreate && !isDelete" :id="updateId" :show="isCreate" @onCacel="cancelCreatePayment($event)">
      {{ title }}
    </CreatePayment>
    <q-separator dark />
  </div>
</template>

<script>
import CreatePayment from 'components/payments/createPayment'
import PaymentsTable from 'components/payments/paymentsTable'
import { mapActions } from 'vuex'

export default {
  name: 'OfflinePayments',
  components: { PaymentsTable, CreatePayment },
  data() {
    return {
      isCreate: false,
      isDelete: false,
      updateId: '',
      title: 'Create Payments'
    }
  },
  created() {
    this.createPayment({ show: true })
  },
  methods: {
    ...mapActions('payments', ['errorMsgReset']),
    ...mapActions('map', ['fetchPlanOptionsForOfflinePayment']),
    async createPayment(event) {
      const errorMsgs = {
        email: false,
        email_msg: '',
        first_name: false,
        first_name_msg: '',
        last_name: false,
        last_name_msg: '',
        plan_name: false,
        plan_name_msg: ''
      }
      this.errorMsgReset(errorMsgs)
      if (event.show) {
        await this.fetchPlanOptionsForOfflinePayment()
        if (this.isCreate) {
          this.isCreate = false
        } else {
          this.title = ''
          this.title = 'Create Payments'
          this.isCreate = true
          this.updateId = ''
        }
      }
    },
    cancelCreatePayment(event) {
      if (event.show) {
        this.isCreate = false
        this.isDelete = false
      }
    },
    updatePayment(event) {
      if (event.show) {
        if (this.isCreate) {
          this.isCreate = false
        } else {
          this.isCreate = true
          this.updateId = event.id
          this.title = 'Update Media'
          const data = {
            media_id: event.id
          }
          this.fetchMediaById(data)
        }
      }
    }
  }
}
</script>
