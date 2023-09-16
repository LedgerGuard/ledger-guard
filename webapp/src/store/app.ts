// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
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
