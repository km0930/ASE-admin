<template>
  <router-view />
</template>

<script setup>
import { Auth } from '@aws-amplify/auth'
import Amplify from '@aws-amplify/core'
import config from 'src/config'

Amplify.configure(config.awsExports)
Auth.configure(config.awsExports)
</script>
