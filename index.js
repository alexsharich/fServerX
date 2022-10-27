const express = require('express')
const app = express()
const {addUser,getUsers} = require('./repository')
const users = require('./users-router')
const cors =require('cors')
const bodyParser = require('body-parser')

let PORT = 7542

app.use(cors())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use('/users',users)
app.get('/tasks',async (req,res)=>{
 res.send('TASKS')
})
app.use((req,res)=>{
  res.send(404)
})


app.listen(7542,function(){
  console.log(`Node.js web server at port ${PORT} is running..`)
})




