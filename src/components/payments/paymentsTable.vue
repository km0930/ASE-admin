<template>
  <div class="viewPages">
    <q-separator class="bg-primary" style="margin-top: 1%; margin-bottom: 1%" />
    <div class="row">
      <div class="col-md-6 col-sm-6 col-xs-6" style="padding: 1%">
        <q-btn size="md" color="primary" @click="createPayment({ show: true })">Create</q-btn>
      </div>
    </div>
    <q-table
      :table-header-style="{ backgroundColor: '#191919' }"
      :rows="listPaymentsGetter"
      class="q-table th.sortable sticky-header-table"
      :visible-columns="roleIsAdmin ? ['first_name', 'last_name', 'email', 'Action'] : ['first_name', 'last_name', 'email']"
      :columns="columns"
      row-key="index"
      :rows-per-page-options="[0]"
      virtual-scroll
      style="max-height: 70vh"
      hide-bottom
      dark
    >
      <template v-slot:body-cell-first_name="props">
        <q-td :props="props">
          <q-item style="max-width: 420px">
            <q-item-section>
              <q-item-label class="text-white text-subtitle2">
                {{ props.row.first_name }}
                <q-tooltip>{{ props.row.first_name }}</q-tooltip>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-td>
      </template>
    </q-table>
    <div align="center" v-if="Object.keys(paginationKeyForward).length > 0">
      <q-btn
        label="Load More"
        icon="keyboard_arrow_right"
        v-bind:class="{ disable_class: Object.keys(paginationKeyForward).length === 0 }"
        style="border: 2px solid white; margin: 7px 0px 7px 0px"
        :disable="Object.keys(paginationKeyForward).length === 0"
        @click="loadMorePayments(paginationKeyForward)"
      />
    </div>
  </div>
</template>

<script>
import { urlSafeBase64Encode } from 'src/utils/reuseFunctions'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PaymentsTable',
  components: {},
  data() {
    return {
      search: '',
      currentPage: 1,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 8
      },
      columns: []
    }
  },
  methods: {
    ...mapActions('payments', ['fetchPaymentsList', 'searchPayments', 'searchByNameAction']),
    createPayment(event) {
      if (event.show) {
        this.$emit('createPayment', {
          show: true
        })
      }
    },
    setPage(page) {},
    goToCoursePage(id) {
      this.$router.push(`/portal/subject/${urlSafeBase64Encode(id)}`)
    },
    updatePayment(id) {
      this.$emit('updatePayment', { show: true, id: id })
    },
    deletePayments(id) {
      this.$emit('deletePayments', { show: true, id: id })
    },
    loadMorePayments(pagination) {
      let data = {}
      if (Object.keys(pagination).length === 0) {
        data = {
          pagination: {},
          reset: false
        }
        this.fetchPaymentsList(data)
      } else {
        data = {
          pagination: {
            pagination: pagination
          },
          reset: false
        }
        if (this.searchByNameGetter && this.searchFireActive) {
          data.pagination.pk = 'payments'
          data.pagination.query = this.searchByNameGetter
          this.searchPayments(data)
        } else {
          this.fetchPaymentsList(data)
        }
      }
    },
    async searchData() {
      if (this.searchByNameGetter === ' ' || this.searchByNameGetter === '') {
        const data = {
          pagination: {},
          reset: true
        }
        await this.fetchPaymentsList(data)
      } else {
        const data = {
          pagination: {
            pk: 'payments',
            query: this.searchByNameGetter
          },
          reset: true
        }
        await this.searchPayments(data)
      }
    },
    clearSearchData() {
      const reset = ''
      this.searchByNameAction(reset)
      const data = {
        pagination: {},
        reset: true
      }
      this.fetchPaymentsList(data)
    }
  },
  computed: {
    searchByName: {
      get() {
        return this.$store.state.payments.searchByName
      },
      set(value) {
        this.$store.commit('payments/SEARCH_BY_NAME', value)
      }
    },
    ...mapGetters('payments', {
      isLoading: 'isLoading',
      listPaymentsGetter: 'listPaymentsGetter',
      paginationKeyForward: 'paginationKeyForward',
      searchByNameGetter: 'searchByNameGetter',
      searchFireActive: 'searchFireActive'
    }),
    ...mapGetters('login', {
      roleIsAdmin: 'roleIsAdmin'
    }),
    pageCount() {
      return Math.ceil(this.listPaymentsGetter.length / 8)
    }
  }
}
</script>
<style lang="sass">
.sticky-header-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th,
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
</style>
