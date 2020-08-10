'use strict'
const express = require('express')
const router = express.Router()
const dashboardController=require('../../controllers/dashboardController')
const validator = require('express-validation')
const { create } = require('../../validations/user.validation')
const auth = require('../../middlewares/authorization')

router.get('/dashboard',auth(['admin']),(req, res) => { 
    res.render('pages/dashboard')
}) // api statu
router.get('/register',(req,res)=>{
    res.render('auth/register')
});
router.post('/register',validator(create),dashboardController.submitRegister)

router.get('/login',(req,res)=>{
    res.render('auth/login')
});
router.post('/login',dashboardController.submitLogin)

module.exports = router
