import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'

import UserModel from '../models/User.js'

export const register = async (req,res)=>{
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
  }

export const login = async (req,res)=>{
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
}  

export const getMe = async (req,res)=>{
  try{
    const user = await UserModel.findById(req.userId) // находим в БД пользователя. req.userId получаем из checkAuth 
  
    if(!user){
      return res.status(404).json({
        message:'User not found ...'
      })
    }
    const {passwordHash,...userData} = user._doc;
  
    res.json(userData) // возвращаем информацию о пользователе и токен
  } catch(err){
    console.log(err)
    res.status(500).json({
      message:'No access...'
    })
  }
  }