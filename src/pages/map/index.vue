<template>
  <q-tabs align="justify">
    <q-route-tab label="Course map" icon="map" to="/portal/map" exact replace />
    <q-route-tab label="Bundle" icon="inventory_2" to="/portal/map/bundle" exact replace />
  </q-tabs>
  <RouterView />
</template>

<script setup></script>
