<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <Bar id="my-chart-id" :options="getChartOptions()" :data="getChartData()" />
    </v-responsive>
  </v-container>
</template>

<script lang="ts">
import { useAppStore } from '@/store/app';
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: {
    Bar
  },
  async setup() {
    const store = useAppStore()
    const results = await store.getResults();

    return { store, results }
  },
  methods: {
    getChartData() {
      return {
        labels: ['Yes', 'No'],
        datasets: [
          {
            label: 'Votes',
            backgroundColor: ['#3f51b5', '#f44336'],
            data: [this.results.yes, this.results.no]
          }
        ]
      }
    },
    getChartOptions() {
      return {
        scales: {
          y: {
            beginAtZero: true,
            
          }
        }
      }
    }
  }
}
</script>
