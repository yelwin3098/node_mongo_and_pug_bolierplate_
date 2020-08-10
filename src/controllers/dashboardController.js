'use strict'

const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const config = require('../config')
const httpStatus = require('http-status')
const uuidv1 = require('uuid/v1')

exports.submitRegister = async (req, res, next) => {
  try {
    const activationKey = uuidv1()
    const body = req.body
    body.activationKey = activationKey
    const user = new User(body)
    const savedUser = await user.save()
    res.status(httpStatus.CREATED)
    // res.send(savedUser.transform())
    res.render('auth/login')
  } catch (error) {
    return next(User.checkDuplicateEmailError(error))
  }
}
exports.submitLogin = async (req, res, next) => {
  try {
    const user = await User.findAndGenerateToken(req.body)
    const checkAdmin=await User.findById(user.id)
    if(checkAdmin.role === 'admin'){
      res.redirect('/auth/dashboard')
    }
    res.send({'messaage':"Your are "+ checkAdmin.role +" role"})
  } catch (error) {
    next(error)
  }
}
