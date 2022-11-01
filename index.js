import express from 'express'
import mongoose from 'mongoose'

import {registerValidation,loginValidation, postCreateValidation} from './validations.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose.connect('mongodb+srv://alexandev444:s201290935s@cluster0.zuwj3nx.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=>{console.log('DB ok')})
.catch((err)=>{console.log('DB error',err)})// подключение к базе данных

const app = express()

app.use(express.json())// получение информации из тела запроса

app.post('/auth/login',loginValidation, UserController.login )
app.post('/auth/register',registerValidation, UserController.register )
app.get('/auth/me',checkAuth, UserController.getMe)

app.get('/posts',PostController.getAll)
app.get('/posts/:id',PostController.getOne)
app.post('/posts',checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id',checkAuth,PostController.remove)
app.patch('/posts/:id',checkAuth,PostController.update)


app.listen(4444,(err)=>{
  if(err){
    return console.log(err)
  }
  console.log(`Node.js web server at port 4444 is running..`)
})

/* const express = require('express')
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




 */