import { defineStore } from 'pinia'
import { VoteCampain } from '@/utils/blockchainVotingSystem';
import {MY_PRIVATE_KEY, MY_ACCOUNT_ID} from '@/utils/env.json'

interface Poll {
  startDate: Date;
  endDate: Date;
  label: string;
  options: string[];
  numberOfParticipants: number;
}

export const useAppStore = defineStore('app', {
  state: () => ({
    poll: null as null | Poll,
    privateKey: null as string | null,
    answer: null as string | null,
    voteCampain: null as null | VoteCampain,
    users : Array() ,
    candidates: Array() ,
    activeToken: null as null | string,
  }),
  getters: {
    loggedIn: (state) => !!state.privateKey,
    voted: (state) => !!state.answer
  },
  actions: {
    setPrivateKey(privateKey: string | null) {
      this.privateKey = privateKey
    },
    async setPoll(poll: Poll) {

      this.poll = await poll;
      let usersNum = this.poll.numberOfParticipants
      console.log("Dio can i porchi " + usersNum)

      this.voteCampain =  new VoteCampain(MY_ACCOUNT_ID, MY_PRIVATE_KEY)
      const treasury  = await this.voteCampain.createTreasury()

      this.activeToken = await this.voteCampain.generateToken(treasury.accountId, treasury.privateKey, usersNum)
      //for (const option of this.options){


      for (const option of this.poll.options) {
        let candidate = await this.voteCampain.createAccount(0, option.toString())
        await this.voteCampain.associateToken(this.activeToken, candidate.accountId, candidate.privateKey);
      }

      this.users = await this.voteCampain.createAccounts(this.usersNum, 10, '')
      for (let i = 0; i < this.users.length; i++){
        await this.voteCampain.associateToken(this.activeToken, this.users.accountIds[i], this.users.accountPrivateKeys[i]);

        console.log("Setup successfull")



      }

      console.log(this.voteCampain)
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
