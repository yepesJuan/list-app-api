const { MongoClient } = require('mongodb')
const { dbConfig }= require('./dbConfig')

const client = new MongoClient(dbConfig.url)

let isConnected = false 

exports.getClient = async () => {
    if(!isConnected) {
        await client.connect()
        isConnected = true 
    }   
    return client 
}
