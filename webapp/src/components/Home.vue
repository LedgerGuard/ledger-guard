<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1 class="text-h2 font-weight-bold">Who are you?</h1>
      <div class="py-8" />
      <router-link :to="{ name: 'Unicc' }">
        <v-btn size="x-large" color="indigo-darken-3" variant="flat" min-width="164" rel="noopener noreferrer"
          class="mx-2">UNICC</v-btn>
      </router-link>
      <router-link :to="{ name: 'Voter' }">
        <v-btn size="x-large" color="indigo-darken-3" variant="flat" min-width="164" rel="noopener noreferrer"
          class="mx-2">VOTER</v-btn>
      </router-link>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import router from '@/router';

export default {
  methods: {
    goToUnicc() {
      router.push({ name: 'Unicc' });
    },
    goToVoter() {
      router.push({ name: 'Voter' })
    }
  }
}
</script>
