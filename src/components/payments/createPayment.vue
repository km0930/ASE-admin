<template>
  <q-dialog v-model="dataShow" persistent transition-show="flip-down" transition-hide="flip-down">
    <q-card style="max-width: 750px" dark>
      <q-card-section>
        <div class="text-subtitle1 ase-roboto text-weight-normal">
          <q-icon name="create" />
          {{ id ? 'Update User' : 'Create User' }}
          <hr />
        </div>
      </q-card-section>
      <q-form greedy @submit="onSubmit()">
        <q-card-section>
          <q-list class="row">
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput autofocus label="First Name *" required :rules="shortName" v-model="user.first_name" />
                <p v-if="fetchErrorMsgs.first_name" class="text-caption text-negative">{{ fetchErrorMsgs.first_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Last Name *" required :rules="shortName" v-model="user.last_name" />
                <p v-if="fetchErrorMsgs.last_name" class="text-caption text-negative">{{ fetchErrorMsgs.last_name_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseInput label="Email *" required :rules="email" type="email" v-model="user.email" />
                <p v-if="fetchErrorMsgs.email" class="text-caption text-negative">{{ fetchErrorMsgs.email_msg }}</p>
              </q-item-section>
            </q-item>
            <q-item class="col-sm-6 col-xs-12">
              <q-item-section>
                <BaseSelect label="Plan Type *" :options="getListPlansOffline" :rules="required" v-model="user.plan" />
                <p v-if="fetchErrorMsgs.plan" class="text-caption text-negative">{{ fetchErrorMsgs.plan_msg }}</p>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions>
          <q-btn class="col-grow" color="orange" outline @click="onCancel()">Cancel</q-btn>
          <q-btn
            class="col-grow"
            color="positive"
            :disable="!user.first_name || !user.last_name || !user.email || !user.typeUser"
            type="submit"
          >
            Save
          </q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import BaseInput from 'components/shared/BaseInput.vue'
import BaseSelect from 'components/shared/BaseSelect.vue'
import { email, required, shortName } from 'src/utils/rules'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'CreatePayment',
  components: { BaseInput, BaseSelect },
  props: ['id', 'show'],
  data() {
    return {
      user: {
        first_name: '',
        last_name: '',
        email: '',
        plan: null
      },
      email,
      required,
      shortName,
      dataShow: this.show
    }
  },
  methods: {
    ...mapActions('payments', ['createPayments']),
    async onSubmit() {
      const data = {
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        plan: this.user.plan ? this.user.plan.value : ''
      }
      await this.createPayments(data)
      if (this.fetchStatusOfApi) {
        this.onCancel()
      }
    },
    onCancel() {
      this.$emit('onCacel', { show: true })
    }
  },
  computed: {
    ...mapGetters('payments', ['fetchStatusOfApi', 'fetchErrorMsgs']),
    ...mapGetters('map', ['getListPlansOffline'])
  }
}
</script>
