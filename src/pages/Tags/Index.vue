<template>
  <TagsTable />
</template>
<script setup>
import TagsTable from 'components/tags/TagsTable.vue'
import { useTagsStore } from 'src/stores'
import { onMounted } from 'vue'
const tagsStore = useTagsStore()

onMounted(async () => {
  tagsStore.getTagList({ tag_name: '' })
})
</script>
<style></style>
