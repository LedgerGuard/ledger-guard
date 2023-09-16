// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    poll: {
      startDate: new Date('2021-01-01'),
      endDate: new Date('2023-09-16T22:04'),
      label: 'Should we use Vue 3?',
      options: [
        'Si',
        'No',
        'Forse'
      ]
    },
    privateKey: null as string | null,
    answer: null as string | null
  }),
  getters: {
    loggedIn: (state) => !!state.privateKey,
    voted: (state) => !!state.answer
  },
  actions: {
    setPrivateKey(privateKey: string | null) {
      this.privateKey = privateKey
    },
    remainingTimeInMilliseconds() {
      return +this.poll.endDate - +new Date();
    },
    async vote(answer: string) {
      this.answer = answer
    },
    async getResults() {
      return new Promise<{ yes: number, no: number }>((resolve) => {
        setTimeout(() => {
          resolve({
            yes: 60,
            no: 40
          });
        }, 1000)
      });
    }
  }
})
