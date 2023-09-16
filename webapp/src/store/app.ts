import { defineStore } from 'pinia'

interface Poll {
  startDate: Date;
  endDate: Date;
  label: string;
  options: string[];
}

export const useAppStore = defineStore('app', {
  state: () => ({
    poll: null as null | Poll,
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
    setPoll(poll: Poll) {
      this.poll = poll;
    },
    remainingTimeInMilliseconds() {
      return this.poll ? +this.poll.endDate - +new Date() : null; 
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
