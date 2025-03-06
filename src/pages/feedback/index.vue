<template>
  <FeedbackTable :coursename="nameCourse"></FeedbackTable>
</template>

<script setup>
import FeedbackTable from 'components/feedback/FeedbackTable.vue'
import { urlSafeBase64Decode } from 'src/utils/reuseFunctions'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const nameCourse = ref(urlSafeBase64Decode(route.params.courseName))
</script>
