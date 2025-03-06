<template>
  <q-layout>
    <q-page-container class="padding_12">
      <q-page class="flex bg-primary flex-center">
        <q-img class="absolute-top q-ma-md" src="logo.svg" width="10rem" />
        <q-card v-bind:style="$q.screen.lt.sm ? { width: '90%' } : { width: '40%' }" class="text-white login_height" dark>
          <q-card-section>
            <div class="text-h5 ase-roboto text-weight-normal flex flex-center padding_12">Sign in</div>
          </q-card-section>
          <q-separator dark />
          <br />
          <q-card-section v-if="login_page">
            <q-form autocomplete="off" class="q-gutter-y-md padding_12" greedy @submit.prevent="onSubmit()">
              <q-input
                autofocus
                color="white"
                dark
                label="Email"
                label-color="white"
                lazy-rules
                mask=""
                outlined
                reverse-fill-mask
                required
                :rules="email"
                type="email"
                v-model="login.username"
              />
              <p v-if="fetchErrorMsgs.username" class="text-caption text-negative">{{ fetchErrorMsgs.username_msg }}</p>
              <q-btn color="primary" :loading="loading" label="Sign in Without Password" size="lg" style="width: 100%" type="submit">
                <template v-slot:loading>
                  <q-spinner-puff v-if="loading" color="deep-orange" />
                </template>
              </q-btn>
            </q-form>
          </q-card-section>
          <q-card-section v-else>
            <q-form v-if="!confirm_codes" greedy @submit="onSubmitForgotPassword()">
              <p class="text_center portal_font_family portal_sm">* Generate Password Code</p>
              <BaseInput label="Email *" required :rules="email" type="email" v-model="forgotpwd.email" />
              <p v-if="fetchErrorMsgsForgotPwd.email" class="text-caption text-negative">{{ fetchErrorMsgsForgotPwd.email_msg }}</p>
              <p v-if="fetchErrorMsgsForgotPwdWithHash.email" class="text-caption text-negative">
                {{ fetchErrorMsgsForgotPwdWithHash.email_msg }}
              </p>
              <q-btn class="full-width" color="primary" label="Submit" type="submit" />
            </q-form>
            <q-form v-if="confirm_codes" autocomplete="off" greedy @submit="onSubmitConfirmationCodesPassword()">
              <p class="text_center portal_font_family portal_sm">
                * Password code can generate by providing registered email on forgot password field
              </p>
              <BaseInput label="Email *" required :rules="email" type="email" v-model="forgotpwd.email" />
              <p v-if="fetchErrorMsgsForgotPwd.email" class="text-caption text-negative">{{ fetchErrorMsgsForgotPwd.email_msg }}</p>
              <BaseInput autofocus label="Code *" required v-model="forgotpwd.code" />
              <p v-if="fetchErrorMsgsForgotPwdWithHash.code" class="text-caption text-negative">
                {{ fetchErrorMsgsForgotPwdWithHash.code_msg }}
              </p>
              <BaseInput
                label="New Password"
                :rules="[
                  (val) => /[0-9]/.test(val) || 'Make sure to provide at least one number',
                  (val) => /[a-z]/.test(val) || 'Make sure to provide at least one lowercase',
                  (val) => /[A-Z]/.test(val) || 'Make sure to provide at least one uppercase',
                  (val) => /[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]/.test(val) || 'Make sure to provide at least one special character',
                  (val) => val.length >= 8 || 'Make sure to provide at least 8 characters'
                ]"
                type="password"
                v-model="forgotpwd.password"
              />
              <p v-if="fetchErrorMsgsForgotPwdWithHash.password" class="text-caption text-negative">
                {{ fetchErrorMsgsForgotPwdWithHash.password_msg }}
              </p>
              <q-btn class="full-width" color="primary" label="Set password" type="submit" />
            </q-form>
            <div class="flex justify-between q-pt-md">
              <q-btn label="Login Page" size="sm" class="portal_font_family portal_bold" type="button" @click="LoginPage()" />
              <q-btn
                :label="!confirm_codes ? 'Has Password Code' : 'Generate Password Code'"
                size="sm"
                class="portal_font_family portal_bold"
                type="button"
                @click="confirm_codes = !confirm_codes"
              />
            </div>
          </q-card-section>
        </q-card>

        <q-dialog v-model="showMagicLinkDialog">
          <q-card dark style="width: 700px; min-height: 250px" :bordered="false">
            <q-card-section class="text-right">
              <q-btn flat icon="close" round size="md" @click="closeDialog" />
            </q-card-section>
            <q-card-section class="none-spacing">
              <div class="row none-spacing" style="padding-right: 5%; padding-left: 5%; padding-bottom: 5%">
                <div class="q-pa-xs col-12" align="middle">
                  <p class="ase-roboto text-h5 text-weight-medium text-white">Magic Link Sent to your email</p>
                  <p class="ase-roboto text-subtitle1 text-weight-regular text-white">
                    We have sent an email with sign-in link. Please sign-in using that link. The link will expire in three minutes.
                  </p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import BaseInput from 'app/src/components/shared/BaseInput.vue'
import { LocalStorage, Notify } from 'quasar'
import { useLoginStore } from 'src/stores'
import { email } from 'src/utils/rules'
import { computed, ref } from 'vue'

const loginStore = useLoginStore()
const loading = computed(() => loginStore.loading)
const addedNewPwd = computed(() => loginStore.addedNewPwd)
const fetchErrorMsgs = computed(() => loginStore.fetchErrorMsgs)
const fetchErrorMsgsForgotPwd = computed(() => loginStore.fetchErrorMsgsForgotPwd)
const fetchErrorMsgsForgotPwdWithHash = computed(() => loginStore.fetchErrorMsgsForgotPwdWithHash)
const showMagicLinkDialog = ref(false)
const login = ref({
  username: '',
  password: ''
})
const forgotpwd = ref({
  email: '',
  pwd_policy: '',
  new_code: ''
})
const msgErr = ref('')
const login_page = ref(true)
const confirm_codes = ref(false)
const error_msgs_pwd = ref({
  username: false,
  username_msg: '',
  non_fields: false,
  non_fields_msg: '',
  pwd_policy: false,
  pwd_policy_msg: '',
  new_code: false,
  new_code_msg: ''
})

async function onSubmit() {
  loginStore.loginStatus(true)
  try {
    await loginStore.loginData({ username: login.value.username })
    LocalStorage.set('email', login.value.username)
    loginStore.loginStatus(false)
    showMagicLinkDialog.value = true
    const unix = Math.round(+new Date() / 1000) + 175
    LocalStorage.set('timeStampLogin', unix)
  } catch (e) {
    loginStore.loginStatus(false)
    msgErr.value = e.message
    switch (e.message) {
      case "CreateAuthChallenge failed with error 'email'.":
        msgErr.value = `${"User doesn't exists"}`
        break
      case 'Password did not conform with policy: Password not long enough':
        break
      case 'User is not confirmed.':
        msgErr.value = `${'User is not confirmed.'}`
        break
      case 'Incorrect username or password.':
        break
      case 'User does not exist.':
        msgErr.value = `${'User does not exist.'}`
        break
      case 'Username cannot be empty':
        msgErr.value = `${'Please enter a valid email'}`
        break
      default:
        msgErr.value = `${e.message}`
    }
  }
  if (msgErr.value) {
    Notify.create({ type: 'negative', position: 'top', progress: true, icon: 'warning', message: msgErr })
  }
}
async function onSubmitForgotPassword() {
  const data = { email: this.forgotpwd.email }
  await loginStore.forgotPassword(data)
  if (this.fetchErrorMsgsForgotPwd.status) {
    this.forgotpwd.email = ''
  }
}
function closeDialog() {
  showMagicLinkDialog.value = false
}
async function onSubmitConfirmationCodesPassword() {
  const data = {
    email: this.forgotpwd.email,
    code: this.forgotpwd.code,
    password: this.forgotpwd.password
  }
  await loginStore.setPasswordWithConfirmationCodes(data)
  if (addedNewPwd.value) {
    this.LoginPage()
  }
  if (this.fetchErrorMsgsForgotPwdWithHash.status) {
    forgotPwd.value = { email: '', password: '', code: '' }
  }
}

function forgotPwd() {
  login_page.value = false
  error_msgs_pwd.value = {
    username: false,
    username_msg: '',
    non_fields: false,
    non_fields_msg: '',
    pwd_policy: false,
    pwd_policy_msg: '',
    new_code: false,
    new_code_msg: ''
  }
}
function LoginPage() {
  login_page.value = true
  confirm_codes.value = false
  error_msgs_pwd.value = {
    username: false,
    username_msg: '',
    non_fields: false,
    non_fields_msg: '',
    pwd_policy: false,
    pwd_policy_msg: '',
    new_code: false,
    new_code_msg: ''
  }
  forgotpwd.value = { email: '', code: '', password: '' }
}
</script>
