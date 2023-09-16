<template>
  <suspense>
    <template #default>
      <Results />
    </template>
    <template #fallback>
      <span>Loading...</span>
    </template>
  </suspense>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';

const Results = defineAsyncComponent(() => import('@/components/Results.vue'))
</script>
