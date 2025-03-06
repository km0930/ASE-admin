<template>
  <BundleTable />
</template>

<script setup>
import BundleTable from 'components/bundles/BundleTable'
import { useBundleStore, useMapStore } from 'src/stores'
import { onMounted } from 'vue'

const bundleStore = useBundleStore()
const mapStore = useMapStore()

onMounted(async () => {
  await bundleStore.searchAllBundle()
  await mapStore.fetchMaps({ pagination: {}, reset: true })
})
</script>
