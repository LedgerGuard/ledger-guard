//import { createClient } from 'redis'

class DbConnector{
    client = null;
    constructor() {
        this.client = createClient();
        this.client.on('error', err => console.log('Redis Client Error', err));
    }

    async connect(){
        await this.client.connect();
    }

    async get(key){
        return await this.client.get(key);
    }

    async set(key, value){
        await this.client.set(key, value);
    }
}



export { DbConnector };
