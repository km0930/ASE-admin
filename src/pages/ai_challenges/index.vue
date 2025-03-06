<template>
  <aiChallengesTable @createPage="show = true" />

  <createAiChallenge v-model:show="show" />
</template>

<script setup>
import aiChallengesTable from 'src/components/aiChallenges/aiChallengeTable'
import createAiChallenge from 'src/components/aiChallenges/createAiChallenge.vue'
import { ref } from 'vue'

const show = ref(false)
</script>
