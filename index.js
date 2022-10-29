import express from 'express'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'
import bcrypt from 'bcrypt'

import {registerValidation} from './validations/auth.js'

import UserModel from './models/User.js'

mongoose.connect('mongodb+srv://alexandev444:s201290935s@cluster0.zuwj3nx.mongodb.net/blog?retryWrites=true&w=majority')
.then(()=>{console.log('DB ok')})
.catch((err)=>{console.log('DB error',err)})// подключение к базе данных


const app = express()

app.use(express.json())// получение информации из тела запроса

app.post('/auth/login', async (req,res)=>{
  try{
const user = await UserModel.findOne({email:req.body.email})
if(!user){
  return res.status(404).json({
    message: 'User not found ...'
  })
}

const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash) //проверка совпадают ли пароли
if (!isValidPass){
  return res.status(400).json({
    message:'Invalid username or password ...'
  })
}

const token = jwt.sign({
  _id:user._id
},'secret123',
{
  expiresIn:'30d'
}) // создаем токен из id

const {passwordHash,...userData} = user._doc;

res.json({
  ...userData,
  token,
}) // возвращаем информацию о пользователе и токен
  }catch(err){
console.log(err)
res.status(500).json({
  message:'Failed to auth...'
})
  }
})

app.post('/auth/register',registerValidation, async (req,res)=>{
try{
  const errors = validationResult(req)
if(!errors.isEmpty()){
  return res.status(400).json(errors.array())
}

const password = req.body.password
const salt = await bcrypt.genSalt(10) // создаем соль для шифровки
const hash = await bcrypt.hash(password,salt) // создаем зашифрованный пароль

const doc = new UserModel({
  email:req.body.email,
  fullName:req.body.fullName,
  avatarUrl:req.body.avatarUrl,
  passwordHash:hash
}) // создание пользователя для записи в базу данных

const user = await doc.save() // создаем пользователя

const token = jwt.sign({
  _id:user._id
},'secret123',
{
  expiresIn:'30d'
}) // создаем токен из id

const {passwordHash,...userData} = user._doc;

res.json({
  ...userData,
  token
}) // возвращаем информацию о пользователе и токен
}catch(err){
  console.log(err)
res.status(500).json({
  message:'Failed to register...'
})
}
})

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