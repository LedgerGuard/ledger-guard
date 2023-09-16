<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1 class="text-h2 font-weight-bold">Insert your private key to vote</h1>
      <div class="py-14" />
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="privateKey" :readonly="loading" :rules="[rules.required]" clearable label="Private key" />
        <v-btn :disabled="!form" :loading="loading" type="submit" size="x-large" color="indigo-darken-3" variant="flat" min-width="164"
          rel="noopener noreferrer" class="mt-4">GO</v-btn>
      </v-form>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import router from '@/router';
import { useAppStore } from '@/store/app';

export default {
  setup() {
    const store = useAppStore()

    return { store }
  },
  data: () => ({
    form: false,
    loading: false,
    privateKey: null as string | null,
    rules: {
      required: (value: string) => !!value || 'Field is required',
    }
  }),

  methods: {
    onSubmit() {
      if (!this.form) {
        return;
      }

      this.loading = true
      setTimeout(() => (this.loading = false), 2000)

      this.store.setPrivateKey(this.privateKey);
      router.push({ name: 'Vote' });
    },
    required(v: string) {
      return !!v || 'Field is required'
    }
  },
}
</script>
