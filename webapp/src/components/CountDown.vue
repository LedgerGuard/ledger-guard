<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <vue-countdown :time="time" @end="onCountdownEnd" v-slot="{ hours, minutes, seconds }">
        {{ hours }} : {{ minutes }} : {{ seconds }}.
      </vue-countdown>
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { useAppStore } from '@/store/app';

export default {
  name: 'CountDown',
  setup() {
    const appStore = useAppStore();
    const time = appStore.remainingTimeInMilliseconds();
    return { time };
  },
  methods: {
    onCountdownEnd() {
      this.$router.push({ name: 'Results' });
    }
  }
}
</script>
