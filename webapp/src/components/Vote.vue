<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1 class="text-h4 font-weight-bold">{{ poll.label }}</h1>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-radio-group v-model="answer" :readonly="loading" :rules="[rules.required]" clearable>
          <v-radio v-for="option of poll.options" :key="option" :label="option" :value="option" />
        </v-radio-group>
        <v-btn :disabled="!form" :loading="loading" type="submit" size="x-large" color="indigo-darken-3" variant="flat" min-width="164"
          rel="noopener noreferrer" class="mt-4">VOTE</v-btn>
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

    return { store, poll: store.poll }
  },
  data: () => ({
    form: false,
    loading: false,
    answer: null as string | null,
    rules: {
      required: (value: string) => !!value || 'Field is required',
    }
  }),
  methods: {
    async onSubmit() {
      if (!this.form) {
        return;
      }

      this.loading = true
      setTimeout(() => (this.loading = false), 2000)

      await this.store.vote(this.answer as string);
      console.log(this.store.answer)
      console.log(this.store.voted)
      router.push({ name: 'CountDown' })
    },
    required(v: string) {
      return !!v || 'Field is required'
    }
  },
}
</script>
