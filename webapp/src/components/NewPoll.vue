<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <h1 class="text-h4 font-weight-bold">Create Ballot</h1>
      <div class="py-14" />
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="label" :readonly="loading" :rules="[rules.required]" clearable label="Label" />
        <v-text-field type="number" v-model="numberOfParticipants" :readonly="loading"
          :rules="[rules.required, rules.positive]" clearable label="N. Participants" />
        <v-text-field type="date" v-model="startDate" :readonly="loading" :rules="[rules.required]" clearable
          label="Start Date" />
        <v-text-field type="date" v-model="endDate" :readonly="loading" :rules="[rules.required]" clearable
          label="End Date" />

        <v-combobox v-model="options" chips clearable label="Options" multiple variant="solo">
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip v-bind="attrs" :model-value="selected" closable @click="select" @click:close="remove(item)">
              <strong>{{ item }}</strong>&nbsp;
              <span>(interest)</span>
            </v-chip>
          </template>
        </v-combobox>


        <v-btn :disabled="!form" :loading="loading" type="submit" size="x-large" color="indigo-darken-3" variant="flat"
          min-width="164" rel="noopener noreferrer" class="mt-4">GO</v-btn>
      </v-form>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import router from '@/router';
import { useAppStore } from '@/store/app';

export default {
  setup() {
    const store = useAppStore();
    return { store };
  },
  data: () => ({
    label: null as null | string,
    numberOfParticipants: null as null | number,
    startDate: null as null | string,
    endDate: null as null | string,
    options: [] as string[],

    form: false,
    loading: false,
    rules: {
      required: (value: any) => !!value || 'Field is required',
      positive: (value: number) => (value > 0) || 'Field must be positive'
    }
  }),

  methods: {
    onSubmit() {
      if (!this.form) {
        return;
      }

      this.loading = true
      setTimeout(() => (this.loading = false), 2000)

      this.store.setPoll({
        startDate: new Date(this.startDate as string),
        endDate: new Date(this.endDate as string),
        label: this.label as string,
        options: [...this.options]
      });
      console.log(this.store.poll)
      router.push({ name: 'CountDown' });
    },
    required(v: string) {
      return !!v || 'Field is required'
    },
    remove(item: string) {
      this.options.splice(this.options.indexOf(item), 1)
    },
  },
}
</script>

