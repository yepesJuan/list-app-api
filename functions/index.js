const functions = require("firebase-functions");
const express = require('express')
const cors = require('cors')
const { createUserItem, getUserItems, updateUserItems, deleteUserItems }  = require('./src/items')


const app = express()
app.use(cors())
app.use(express.json())


app.post('/items', createUserItem)
app.get('user/:uid/items', getUserItems)
app.patch('/items/:itemId', updateUserItems)
app.delete('/users/:uid/items/:itemId', deleteUserItems)


exports.app = functions.https.onRequest(app)
